/**
 * The live drawing. Loaded with import() by Rig once the stage nears the viewport, so three.js
 * never sits in the route bundle. Three draw calls: fills, hidden lines, visible lines. Renders
 * only while something moves; pauses off-screen and in a hidden tab.
 */
import {
  BufferGeometry,
  ColorManagement,
  DoubleSide,
  Float32BufferAttribute,
  GreaterDepth,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LessEqualDepth,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import {
  anchors,
  basis,
  boxes,
  callouts,
  dot,
  LAYERS,
  moved,
  N,
  P_END,
  parts,
  PITCH,
  pose,
  segs,
  YAW,
  type Basis,
  type V3,
} from "./model"

export type Engine = { select(layer: number): void; dispose(): void }

export type EngineOptions = {
  stage: HTMLElement
  canvas: HTMLCanvasElement
  overlay: SVGSVGElement
  labels: HTMLElement
  /** Beat articles in order; data-l is the layer index, -1 for the overview. */
  beats: HTMLElement[]
  /** Parts-list buttons, in layer order. Desktop draws a leader from each. */
  rows: HTMLElement[]
  /** The text column and the parts list: the drawing fits between them on desktop. */
  column: HTMLElement
  list: HTMLElement
  text(key: string): string
  calloutClass: string
  onActive(layer: number): void
  onPick(layer: number): void
  onClear(): void
  onGl(on: boolean): void
}

/* ---------- geometry: every box and segment merged into two buffers ---------- */

function buildFill() {
  const pos: number[] = []
  const nor: number[] = []
  const part: number[] = []
  const tone: number[] = []
  const quad = (i: number, t: number, n: V3, ...v: V3[]) => {
    for (const k of [0, 1, 2, 0, 2, 3]) {
      pos.push(...v[k])
      nor.push(...n)
      part.push(i)
      tone.push(t)
    }
  }
  for (const { part: i, a, b, tone: t } of boxes) {
    const [x0, y0, z0] = a
    const [x1, y1, z1] = b
    quad(i, t, [0, 1, 0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0])
    quad(i, t, [0, -1, 0], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1])
    quad(i, t, [0, 0, 1], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
    quad(i, t, [0, 0, -1], [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0])
    quad(i, t, [1, 0, 0], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1])
    quad(i, t, [-1, 0, 0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0])
  }
  const g = new BufferGeometry()
  g.setAttribute("position", new Float32BufferAttribute(pos, 3))
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3))
  g.setAttribute("aPart", new Float32BufferAttribute(part, 1))
  g.setAttribute("aTone", new Float32BufferAttribute(tone, 1))
  return g
}

/** Edge kinds: 0 crease or silhouette, 3 phantom dash, 4 centre line, 5 rib. */
function buildLines() {
  const A: number[] = []
  const B: number[] = []
  const N1: number[] = []
  const N2: number[] = []
  const M: number[] = []
  const W: number[] = []
  const edge = (pa: number, a: V3, pb: number, b: V3, n1: V3, n2: V3, kind: number, hid: number, w: number) => {
    A.push(...a)
    B.push(...b)
    N1.push(...n1)
    N2.push(...n2)
    M.push(pa, pb, kind, hid)
    W.push(w)
  }
  for (const { part: i, a, b, dashed, hidden, w } of boxes) {
    const [x0, y0, z0] = a
    const [x1, y1, z1] = b
    const k = dashed ? 3 : 0
    const h = hidden ? 1 : 0
    for (const y of [y0, y1])
      for (const z of [z0, z1]) edge(i, [x0, y, z], i, [x1, y, z], [0, y === y1 ? 1 : -1, 0], [0, 0, z === z1 ? 1 : -1], k, h, w)
    for (const x of [x0, x1]) {
      for (const z of [z0, z1]) edge(i, [x, y0, z], i, [x, y1, z], [x === x1 ? 1 : -1, 0, 0], [0, 0, z === z1 ? 1 : -1], k, h, w)
      for (const y of [y0, y1]) edge(i, [x, y, z0], i, [x, y, z1], [x === x1 ? 1 : -1, 0, 0], [0, y === y1 ? 1 : -1, 0], k, h, w)
    }
  }
  for (const s of segs) edge(s.pa, s.a, s.pb, s.b, [0, 0, 0], [0, 0, 0], s.kind, 0, 1)
  const g = new InstancedBufferGeometry()
  g.setAttribute("position", new Float32BufferAttribute([0, -1, 0, 1, -1, 0, 0, 1, 0, 1, 1, 0], 3))
  g.setIndex([0, 1, 3, 0, 3, 2])
  const inst = (name: string, a: number[], size: number) => g.setAttribute(name, new InstancedBufferAttribute(new Float32Array(a), size))
  inst("aA", A, 3)
  inst("aB", B, 3)
  inst("aN1", N1, 3)
  inst("aN2", N2, 3)
  inst("aM", M, 4)
  inst("aW", W, 1)
  g.instanceCount = W.length
  return g
}

/* ---------- shaders ---------- */

const HEAD = `uniform vec4 uOff[${N}];uniform vec4 uLay[${LAYERS}];`

const FILL_V = `${HEAD}uniform vec3 uTc[${LAYERS}];
attribute float aPart,aTone;
varying vec3 vN,vPos,vTc;varying float vTone,vEm,vTint,vHatch;
void main(){
  vec4 o=uOff[int(aPart+.5)];int l=int(o.w+.5);
  vN=normal;vPos=position;vTone=aTone;vEm=uLay[l].x;vTint=uLay[l].y;vHatch=uLay[l].z;vTc=uTc[l];
  gl_Position=projectionMatrix*viewMatrix*vec4(position+o.xyz,1.);
}`

const FILL_F = `precision highp float;
varying vec3 vN,vPos,vTc;varying float vTone,vEm,vTint,vHatch;
const vec3 PAPER=vec3(.894,.91,.875),INK=vec3(.063,.078,.071);
vec3 shade(vec3 top,vec3 front,vec3 side){return vN.y>.5?top:(abs(vN.z)>.5?front:side);}
void main(){
  vec3 c;
  if(vTone>3.5)c=shade(vec3(.91,.263,.165),vec3(.769,.216,.129),vec3(.624,.169,.098));
  else if(vTone>2.5)c=shade(vec3(.071,.22,.839),vec3(.059,.18,.682),vec3(.043,.137,.525));
  else if(vTone>1.5)c=INK;
  else{
    c=shade(vec3(.945,.957,.933),PAPER,vec3(.827,.851,.808));
    c=mix(c,vTc*shade(vec3(1.),vec3(.92),vec3(.8)),mix(.5,1.,vHatch)*vTint);
    float hs=vTone>.5&&abs(vN.x)>.5?1.:.3*vHatch;
    if(hs>.01){
      float h=(abs(vN.y)>.5?vPos.x+vPos.z:(abs(vN.z)>.5?vPos.x+vPos.y:vPos.y+vPos.z))/.28;
      float f=abs(fract(h)-.5)/max(fwidth(h),1e-4);
      c=mix(c,mix(INK,c,.3+.7*smoothstep(.15,.95,f)),hs);
    }
  }
  gl_FragColor=vec4(mix(PAPER,c,vEm),1.);
}`

const LINE_V = `${HEAD}uniform vec3 uV;uniform vec2 uRes;uniform float uDpr,uThick;
attribute vec3 aA,aB,aN1,aN2;attribute vec4 aM;attribute float aW;
varying float vD,vHalf,vL,vK,vE,vT;
void main(){
  int pa=int(aM.x+.5),pb=int(aM.y+.5);float kind=aM.z;
  vec3 a=aA+uOff[pa].xyz,b=aB+uOff[pb].xyz;
  bool sil=dot(aN1,uV)*dot(aN2,uV)<=0.;
  vec4 ca=projectionMatrix*viewMatrix*vec4(a,1.),cb=projectionMatrix*viewMatrix*vec4(b,1.);
  vec2 d=(cb.xy-ca.xy)*uRes*.5;float len=length(d);
  bool kill=len<.01;
  float wd=kind<.5?(sil?uThick*aW:1.):(kind<3.5?1.3:(kind<4.5?.9:.75));
#ifdef HIDDEN
  if(aM.w<.5||kind>3.5)kill=true;
  wd=.9;
#endif
  if(kill){gl_Position=vec4(2.,2.,2.,1.);return;}
  vec4 ly=uLay[int(uOff[pa].w+.5)];vE=ly.x;vT=ly.y;
  wd*=uDpr*mix(.7,1.,vE);
  vec2 u=d/len,n=vec2(-u.y,u.x);
  float half_=wd*.5+.75*uDpr;
  vec4 c=mix(ca,cb,position.x);
  c.xy+=(n*position.y*half_+u*(position.x*2.-1.)*(wd*.5+.4))*2./uRes;
  gl_Position=c;
  vD=position.y*half_;vHalf=wd*.5;vL=position.x*len/uDpr;vK=kind;
}`

const LINE_F = `precision highp float;
varying float vD,vHalf,vL,vK,vE,vT;
void main(){
  float a=1.-smoothstep(vHalf-.55,vHalf+.55,abs(vD));
  float al=mix(.18,1.,vE);
#ifdef HIDDEN
  if(mod(vL,7.)>4.||vT<.01)discard;
  al*=.55*vT;
#else
  if(vK>2.5&&vK<3.5&&mod(vL,11.)>7.)discard;
  if(vK>3.5&&vK<4.5){float m=mod(vL,24.);if(!(m<14.||(m>17.&&m<20.)))discard;al*=.7;}
#endif
  gl_FragColor=vec4(.063,.078,.071,a*al);
}`

/* ---------- engine ---------- */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const NS = "http://www.w3.org/2000/svg"
/**
 * Tint per layer, in its line colour. The shared layers (tenants, repos, rack) belong to neither
 * line and are no interchange either, so they take paper-2 and ink hatching, never the sun.
 */
const TINT = [
  [0.071, 0.22, 0.839],
  [0.91, 0.263, 0.165],
  [0.827, 0.851, 0.808],
  [0.827, 0.851, 0.808],
  [0.827, 0.851, 0.808],
].flat()
const SHARED = [0, 0, 1, 1, 1]

/** Null when the browser gives no WebGL 2 context: the poster stays, and nothing is logged. */
export function start(o: EngineOptions): Engine | null {
  const { stage, canvas, overlay } = o
  // Ask first, so three.js never tries (and logs) on its own.
  const context = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" })
  if (!context) return null
  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false })
  ColorManagement.enabled = false
  renderer.setClearColor(0xe4e8df, 1)

  const off = new Float32Array(N * 4)
  const lay = new Float32Array(LAYERS * 4)
  const shared = { uOff: { value: off }, uLay: { value: lay } }
  const lineU = {
    ...shared,
    uV: { value: new Vector3() },
    uRes: { value: new Vector2() },
    uDpr: { value: 1 },
    uThick: { value: 2.8 },
  }
  const fillGeo = buildFill()
  const lineGeo = buildLines()
  const fillMat = new ShaderMaterial({
    uniforms: { ...shared, uTc: { value: new Float32Array(TINT) } },
    vertexShader: FILL_V,
    fragmentShader: FILL_F,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1.5,
    polygonOffsetUnits: 2,
  })
  const lineMat = (hidden: boolean) => {
    const def = hidden ? "#define HIDDEN\n" : ""
    return new ShaderMaterial({
      uniforms: lineU,
      vertexShader: def + LINE_V,
      fragmentShader: def + LINE_F,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      depthFunc: hidden ? GreaterDepth : LessEqualDepth,
    })
  }
  const mats = [fillMat, lineMat(true), lineMat(false)]
  const scene = new Scene()
  mats.forEach((mat, k) => {
    const mesh = new Mesh(k ? lineGeo : fillGeo, mat)
    mesh.frustumCulled = false
    mesh.renderOrder = k
    scene.add(mesh)
  })
  const cam = new OrthographicCamera(-1, 1, 1, -1, 1, 200)

  /* ---------- state: S follows T, smoothly ---------- */
  const coarse = matchMedia("(pointer: coarse)").matches
  const narrowQ = matchMedia("(max-width: 999px)")
  const wideQ = matchMedia("(min-width: 768px)")
  let narrow = narrowQ.matches
  const yaw0 = () => (narrow ? 0.75 : YAW)
  const pitch0 = () => (narrow ? 0.32 : PITCH)
  const spread = () => (narrow ? 0.55 : 1)
  const S = { p: 0, yaw: yaw0() + 0.16, pitch: pitch0(), iso: Array(LAYERS).fill(0), em: Array(LAYERS).fill(1), tint: Array(LAYERS).fill(0), z: 0, c: [0, 0, 0], cy: 0, cx: 0 }
  const T = { p: 0, yaw: yaw0(), pitch: pitch0(), sel: -1, active: -1 }
  let selY = 0

  /* ---------- layout ---------- */
  let W = 1
  let H = 1
  let avail = { x: 0, y: 0, w: 1, h: 1 }
  /** Labels may stand a little further right than the model: up to just short of the parts list. */
  let labelR = 1
  /** The stack's column stands under the model rather than beside it. */
  let stackBelow = false
  let lead = false
  let stops = [0]
  function measure() {
    const sr = stage.getBoundingClientRect()
    W = sr.width
    H = sr.height
    const was = narrow
    narrow = narrowQ.matches
    if (was !== narrow) {
      T.yaw = yaw0()
      T.pitch = pitch0()
    }
    overlay.setAttribute("viewBox", `0 0 ${W} ${H}`)
    if (narrow) {
      // The page margin, as the beats below use it.
      const m = parseFloat(getComputedStyle(o.column).paddingLeft) || 16
      avail = { x: m, y: 40, w: W - 2 * m, h: H - 40 - 32 }
      labelR = W - m
    }
    else {
      const m = parseFloat(getComputedStyle(o.column.parentElement!).paddingLeft) || 32
      const left = o.column.getBoundingClientRect().right - sr.left + 24
      const list = o.list.getBoundingClientRect().left - sr.left
      lead = list > W * 0.6
      const right = lead ? list - 48 : W - m
      labelR = lead ? list - 16 : right
      avail = { x: left, y: 48, w: right - left, h: H - 112 }
    }
    if (narrow) lead = false
    const ref = narrow ? H + (innerHeight - H) / 2 : innerHeight / 2
    stops = [0]
    o.beats.forEach((b, k) => {
      const r = b.getBoundingClientRect()
      const at = r.top + scrollY + r.height / 2 - ref
      if (k === 0) stops[0] = at
      else stops.push(Math.max(stops[k - 1] + 1, at))
    })
    const last = o.beats[o.beats.length - 1].getBoundingClientRect()
    stops.push(Math.max(stops[stops.length - 1] + 1, last.bottom + scrollY - ref))
    for (const c of labels) {
      const was = c.e.style.display
      c.e.style.display = "block"
      c.w = c.e.offsetWidth
      c.h = c.e.offsetHeight
      c.e.style.display = was
    }
    const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)
    lineU.uRes.value.set(canvas.width, canvas.height)
    lineU.uDpr.value = dpr
    lineU.uThick.value = narrow ? 2.3 : 2.8
    onScroll()
  }

  function onScroll() {
    const y = scrollY
    let p = y <= stops[0] ? 0 : P_END
    for (let k = 0; k < stops.length - 1; k++)
      if (y >= stops[k] && y < stops[k + 1]) {
        p = k + (y - stops[k]) / (stops[k + 1] - stops[k])
        break
      }
    T.p = p
    const beat = o.beats[clamp(Math.round(p), 0, o.beats.length - 1)]
    const active = Number(beat.dataset.l)
    if (active !== T.active) {
      T.active = active
      o.onActive(active)
    }
    if (T.sel >= 0 && Math.abs(y - selY) > Math.max(160, innerHeight * 0.3)) o.onClear()
    invalidate()
  }

  /* ---------- camera ---------- */
  let L = 0
  let TOP = 0
  let Z = 1
  let view: Basis = basis(S.yaw, S.pitch)
  const toPx = (v: V3): [number, number] => [(dot(v, view.r) - L) * Z, (TOP - dot(v, view.u)) * Z]
  function bboxOf(keep: (i: number) => boolean) {
    const a: V3 = [1e9, 1e9, 1e9]
    const b: V3 = [-1e9, -1e9, -1e9]
    parts.forEach((pt, i) => {
      if (!keep(i)) return
      const m = moved(i, pt.min, off)
      const x = moved(i, pt.max, off)
      for (let k = 0; k < 3; k++) {
        a[k] = Math.min(a[k], m[k])
        b[k] = Math.max(b[k], x[k])
      }
    })
    return [a, b]
  }
  /** Screen extents of a box along a view's right and up axes: [x0, x1, y0, y1]. */
  function extent([a, b]: V3[], v: Basis) {
    let [x0, x1, y0, y1] = [1e9, -1e9, 1e9, -1e9]
    for (const X of [a[0], b[0]])
      for (const Y of [a[1], b[1]])
        for (const Zc of [a[2], b[2]]) {
          const p: V3 = [X, Y, Zc]
          const h = dot(p, v.r)
          const w = dot(p, v.u)
          ;[x0, x1, y0, y1] = [Math.min(x0, h), Math.max(x1, h), Math.min(y0, w), Math.max(y1, w)]
        }
    return [x0, x1, y0, y1]
  }
  /** Zoom that fits a box, judged at the resting angle so dragging doesn't pump the scale. */
  function fit(box: V3[], aw: number, ah: number) {
    const [x0, x1, y0, y1] = extent(box, basis(yaw0(), pitch0()))
    return Math.min(aw / (x1 - x0), ah / (y1 - y0))
  }
  function solveCamera(k: number) {
    view = basis(S.yaw, S.pitch)
    const whole = bboxOf(() => true)
    const focus = T.sel >= 0 ? T.sel : T.active
    // A stack of callouts (the four repo names) gets clean paper for its column, so none of them
    // has to drop out: a gutter on the left of the model, or a band under it, whichever leaves the
    // model larger. The right keeps room for a label to stand level beside the model.
    // ponytail: stacks are assumed to stand on the left (side -1), as the rail names do.
    const stk = labels.filter((c) => shows(c) && c.stack)
    let F = avail
    stackBelow = false
    if (stk.length) {
      const rv = basis(yaw0(), pitch0())
      const [bx0, bx1, by0, by1] = extent(whole, rv)
      const right = labels.filter((c) => shows(c) && !c.stack && c.side > 0)
      const slack = labelR - avail.x - avail.w
      // The widest the model may be with `l` kept free on its left. A right label needs its width
      // beyond the model's edge, less how far inside that edge its anchor already sits.
      const width = (l: number) => {
        const free = avail.w - l
        const zs = right.map((c) => {
          const d = bx1 - dot(moved(c.part, c.at, off), rv.r)
          const need = c.w + 30 - slack
          const z = free / (bx1 - bx0)
          return need - d * z > 0 ? (free - need) / (bx1 - bx0 - d) : z
        })
        return (zs.length ? Math.max(...zs) : free / (bx1 - bx0)) * (bx1 - bx0)
      }
      const knees = stk.length * 9 + 24
      const gut = Math.min(avail.w * 0.5, Math.max(...stk.map((c) => c.w)) + knees)
      const band = stk.length * (Math.max(...stk.map((c) => c.h)) + 6) + 16
      const side = { x: avail.x + gut, y: avail.y, w: width(gut), h: avail.h }
      const below = { x: avail.x + knees, y: avail.y, w: width(knees), h: avail.h - band }
      const z = (f: typeof avail) => Math.min(f.w / (bx1 - bx0), f.h / (by1 - by0))
      stackBelow = z(below) > z(side)
      F = stackBelow ? below : side
    }
    const zW = fit(whole, F.w, F.h)
    let zT = zW
    let c = [0, 1, 2].map((i) => (whole[0][i] + whole[1][i]) / 2)
    if (focus >= 0) {
      const b = bboxOf((i) => parts[i].layer === focus)
      const f = T.sel >= 0 ? (narrow ? 0.3 : 0.6) : narrow ? 0.25 : 0.22
      const zL = Math.min(fit(b, F.w * 0.9, F.h * 0.8), zW * (narrow ? 1.5 : 1.6))
      zT = Math.exp(Math.log(zW) * (1 - f) + Math.log(zL) * f)
      c = c.map((v, i) => v + ((b[0][i] + b[1][i]) / 2 - v) * f)
    }
    // The whole model, every part still drawn, must stay inside the free area around that centre,
    // as seen now: never under the beats or the parts list.
    // Cap the zoom at the whole model's fit, then slide the centre only as far as the slack allows.
    const [x0, x1, y0, y1] = extent(whole, view)
    zT = Math.min(zT, F.w / (x1 - x0), F.h / (y1 - y0))
    const slide = (at: number, lo: number, hi: number, room: number) => {
      const a = hi - room / 2 / zT
      const b = lo + room / 2 / zT
      return clamp(at, Math.min(a, b), Math.max(a, b)) - at
    }
    const sx = slide(dot(c as V3, view.r), x0, x1, F.w)
    const sy = slide(dot(c as V3, view.u), y0, y1, F.h)
    c = c.map((v, i) => v + view.r[i] * sx + view.u[i] * sy)
    // Overview: the model sits at the top of the free area, level with the heading, not mid-air.
    // With a stack, too: the paper left over goes under the model, where its labels hang.
    const top = (!narrow && focus < 0 && T.p < 0.5) || stk.length ? (F.h - (y1 - y0) * zT) / 2 : 0
    const cyT = F.y + F.h / 2 - Math.max(0, top)
    const cxT = F.x + F.w / 2
    if (!S.z) {
      S.z = zT
      S.c = c
      S.cy = cyT
      S.cx = cxT
    }
    const dz = zT - S.z
    S.z += dz * k
    S.c = S.c.map((v, i) => v + (c[i] - v) * k)
    S.cy += (cyT - S.cy) * k
    S.cx += (cxT - S.cx) * k
    Z = S.z
    const cw = S.c as V3
    L = dot(cw, view.r) - S.cx / Z
    TOP = dot(cw, view.u) + S.cy / Z
    return Math.abs(dz) / Z > 0.0008 || Math.abs(cyT - S.cy) + Math.abs(cxT - S.cx) > 0.3
  }

  /* ---------- overlay: parts-list leaders (desktop) and callouts for the active layer ---------- */
  // Every leader is routed in straight runs: level, vertical or at 45° with a knee. It must clear
  // every part it doesn't point at, every other leader and every label; where nothing clears, the
  // leader and its label are left out. Labels on one side keep the vertical order of their anchors.
  const mk = (tag: string, attrs: Record<string, string | number>) => {
    const e = document.createElementNS(NS, tag)
    for (const k in attrs) e.setAttribute(k, String(attrs[k]))
    overlay.appendChild(e)
    return e
  }
  const leaders = o.rows.map((_, i) => ({
    halo: mk("path", { fill: "none", stroke: "#e4e8df", "stroke-width": 5, "stroke-opacity": 0.8 }),
    line: mk("path", { fill: "none", stroke: "#101412", "data-layer": i }),
    dot: mk("circle", { r: 0, fill: "#101412" }),
  }))
  const labels = callouts.map((c, i) => {
    const e = document.createElement("div")
    e.className = o.calloutClass
    e.textContent = o.text(c.key)
    e.dataset.i = String(i)
    e.dataset.layer = String(c.layer)
    e.dataset.key = c.key
    o.labels.appendChild(e)
    const path = mk("path", { fill: "none", stroke: "#101412", "stroke-width": 1.2, "data-part": (c.names ?? [c.part]).join(" "), "data-i": i })
    const dot = mk("circle", { r: 0, fill: "#101412" })
    return { ...c, e, path, dot, pick: "", w: 0, h: 0 }
  })
  /** Below 768 there is no room for the four rail names; the beat text names the repos. */
  const shows = (c: { layer: number; key: string }) => c.layer === (T.sel >= 0 ? T.sel : T.active) && !(!wideQ.matches && c.key.startsWith("repo:"))

  type P2 = [number, number]
  type Rect = [number, number, number, number]
  type Poly = { pts: P2[]; bb: Rect }
  type Hull = Poly & { part: number; layer: number }
  const corners = parts.map((_, i) => boxes.filter((b) => b.part === i).map((b) => [b.a, b.b]))
  const turn = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const cross = (a: P2, b: P2, c: P2, d: P2) => turn(a, b, c) * turn(a, b, d) < 0 && turn(c, d, a) * turn(c, d, b) < 0
  /** Convex hull (monotone chain), pulled in by 1.5 px so outlines that only touch don't count. */
  function hullOf(pts: P2[]): P2[] {
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1])
    const half = (list: P2[]) => {
      const out: P2[] = []
      for (const p of list) {
        while (out.length > 1 && turn(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop()
        out.push(p)
      }
      out.pop()
      return out
    }
    const h = [...half(pts), ...half([...pts].reverse())]
    const cx = h.reduce((s, p) => s + p[0], 0) / h.length
    const cy = h.reduce((s, p) => s + p[1], 0) / h.length
    return h.map(([x, y]) => {
      const d = Math.hypot(x - cx, y - cy) || 1
      return [x - ((x - cx) / d) * 1.5, y - ((y - cy) / d) * 1.5]
    })
  }
  const within = (h: Poly, p: P2) => {
    if (p[0] <= h.bb[0] || p[0] >= h.bb[2] || p[1] <= h.bb[1] || p[1] >= h.bb[3]) return false
    let sign = 0
    for (let k = 0; k < h.pts.length; k++) {
      const t = Math.sign(turn(h.pts[k], h.pts[(k + 1) % h.pts.length], p))
      if (t === 0 || (sign && t !== sign)) return false
      sign = t
    }
    return true
  }
  const hits = (h: Poly, a: P2, b: P2) => {
    if (Math.max(a[0], b[0]) <= h.bb[0] || Math.min(a[0], b[0]) >= h.bb[2] || Math.max(a[1], b[1]) <= h.bb[1] || Math.min(a[1], b[1]) >= h.bb[3])
      return false
    if (within(h, a) || within(h, b)) return true
    for (let k = 0; k < h.pts.length; k++) if (cross(a, b, h.pts[k], h.pts[(k + 1) % h.pts.length])) return true
    return false
  }
  const poly = (r: Rect): Poly => ({ pts: [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]], bb: r })
  /** A rect and a part outline share any area. */
  const covers = (h: Poly, r: Rect) => {
    if (h.bb[2] <= r[0] || h.bb[0] >= r[2] || h.bb[3] <= r[1] || h.bb[1] >= r[3]) return false
    if (h.pts.some(([x, y]) => x > r[0] && x < r[2] && y > r[1] && y < r[3])) return true
    const q = poly(r).pts
    return q.some((p, k) => within(h, p) || hits(h, p, q[(k + 1) % 4]))
  }
  const meets =(a: Rect, b: Rect, m: number) => a[0] < b[2] + m && b[0] < a[2] + m && a[1] < b[3] + m && b[1] < a[3] + m
  const path = (pts: P2[]) => pts.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")
  let hulls: Hull[] = []
  // For the in-page crossing check: the outline of every part as last drawn, in stage pixels.
  const probe = stage as HTMLElement & { velaHulls?: () => Hull[]; velaAnchors?: () => unknown[] }
  probe.velaHulls = () => hulls
  probe.velaAnchors = () => labels.map((c) => [c.key, ...toPx(moved(c.part, c.at, off))])

  function drawOverlay() {
    const act = T.sel >= 0 ? T.sel : T.active
    const sr = stage.getBoundingClientRect()
    hulls = parts.map((pt, i) => {
      const pts: P2[] = []
      for (const [a, b] of corners[i]) {
        const m = moved(i, a, off)
        const x = moved(i, b, off)
        for (const X of [m[0], x[0]]) for (const Y of [m[1], x[1]]) for (const Zc of [m[2], x[2]]) pts.push(toPx([X, Y, Zc]))
      }
      const h = hullOf(pts)
      const xs = h.map((p) => p[0])
      const ys = h.map((p) => p[1])
      return { part: i, layer: pt.layer, pts: h, bb: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
    })
    let drawn: [P2, P2][] = []
    let rects: Rect[] = []
    /** Straight legs are clear if they miss every part `skip` doesn't excuse, every leader and every label. */
    const clear = (pts: P2[], skip: (h: Hull) => boolean) => {
      for (let k = 1; k < pts.length; k++) {
        const a = pts[k - 1]
        const b = pts[k]
        for (const h of hulls) if (!skip(h) && hits(h, a, b)) return false
        for (const [c, d] of drawn) if (cross(a, b, c, d)) return false
        for (const r of rects) if (hits(poly(r), a, b)) return false
      }
      return true
    }
    const keep = (pts: P2[]) => {
      for (let k = 1; k < pts.length; k++) drawn.push([pts[k - 1], pts[k]])
    }

    // Parts-list leaders: all five over the overview, then only the live row's.
    o.rows.forEach((row, i) => {
      const g = leaders[i]
      let d = ""
      let A: P2 = [0, 0]
      if (lead && (act < 0 || act === i)) {
        const br = (row.querySelector("b") ?? row).getBoundingClientRect()
        const S: P2 = [br.left - sr.left, br.top - sr.top + br.height / 2]
        for (const an of anchors[i]) {
          A = toPx(moved(an.part, an.at, off))
          const dy = Math.abs(A[1] - S[1])
          const routes: P2[][] = []
          if (dy < 1) routes.push([S, A])
          if (A[0] + dy < S[0] - 12) routes.push([S, [A[0] + dy, S[1]], A])
          if (A[0] < S[0] - 12) routes.push([S, [A[0], S[1]], A])
          if (S[0] - 24 - dy > A[0] + 12) routes.push([S, [S[0] - 24, S[1]], [S[0] - 24 - dy, A[1]], A])
          const ok = routes.find((r) => clear(r, (h) => h.layer === i))
          if (ok) {
            keep(ok)
            d = path(ok)
            break
          }
        }
      }
      const on = act === i
      g.line.setAttribute("d", d)
      g.halo.setAttribute("d", d)
      g.line.setAttribute("stroke-width", on ? "2" : "1")
      g.dot.setAttribute("cx", String(A[0]))
      g.dot.setAttribute("cy", String(A[1]))
      g.dot.setAttribute("r", d ? (on ? "4" : "2.8") : "0")
    })

    // Callouts, top anchor first. Each tries a level leader, then a 45° knee or a vertical leg,
    // up or down, on its own side and then the other, and takes the clear spot that covers least
    // of other parts. If that leaves some out, the pass runs again leaning up, then down, and the
    // pass that places most wins: a tight stack (the four rails) has to fan out one way.
    const hide = (c: (typeof labels)[number]) => {
      c.e.style.display = "none"
      c.path.setAttribute("d", "")
      c.dot.setAttribute("r", "0")
    }
    const live = labels
      .filter((c) => shows(c) || (hide(c), false))
      .map((c) => ({ c, A: toPx(moved(c.part, c.at, off)), own: new Set(c.names ?? [c.part]) }))
      .sort((m, n) => m.A[1] - n.A[1])
    type Spot = { pts: P2[]; r: Rect; key: string; ly: number; s: number }
    const F = avail
    // A stack (the four rail names) is one aligned column on paper beside or under the model.
    // Each leader runs level from its anchor to its own knee, then up or down, then level into
    // the column. Knees are ordered so that no leg crosses another.
    const stack = live.filter((m) => m.c.stack)
    const fixed = new Map<(typeof live)[number], Spot>()
    if (stack.length) {
      const s = stack[0].c.side
      const pitch = Math.max(...stack.map((m) => m.c.h)) + 6
      const wide = Math.max(...stack.map((m) => m.c.w))
      const n = stack.length
      const ax = stack.map((m) => m.A[0])
      const ay = stack.map((m) => m.A[1])
      const besideX = (lo: number, hi: number) => {
        const xs = [...ax, ...hulls.filter((h) => h.bb[1] < hi && h.bb[3] > lo).map((h) => h.bb[s < 0 ? 0 : 2])]
        return (s < 0 ? Math.min(...xs) : Math.max(...xs)) + s * 10
      }
      let ly: number[]
      let kx: number[]
      let rs: Rect[]
      if (stackBelow) {
        // Under the model: the lowest anchor takes the innermost knee and the top label.
        const edge = besideX(Math.min(...ay) - pitch, F.y + F.h + n * pitch + 16)
        const col = edge - s * 14
        const span: Rect = s < 0 ? [col, 0, col + wide, 0] : [col - wide, 0, col, 0]
        const floor = Math.max(...ay, ...hulls.filter((h) => h.bb[0] < span[2] && h.bb[2] > span[0]).map((h) => h.bb[3]))
        ly = stack.map((_, k) => floor + 14 + pitch / 2 + (n - 1 - k) * pitch)
        kx = stack.map((_, k) => edge + s * (n - 1 - k) * 9)
        rs = stack.map(({ c }, k) => (s < 0 ? [col, ly[k] - c.h / 2, col + c.w, ly[k] + c.h / 2] : [col - c.w, ly[k] - c.h / 2, col, ly[k] + c.h / 2]))
      } else {
        // Beside it: labels spread around their anchors; knees step out toward the labels that
        // move least.
        const mid = ay.reduce((t, y) => t + y, 0) / n
        const y0 = clamp(mid - ((n - 1) * pitch) / 2, F.y + pitch / 2, F.y + F.h - pitch / 2 - (n - 1) * pitch)
        ly = stack.map((_, k) => y0 + k * pitch)
        const edge = besideX(Math.min(...ly, ...ay) - pitch, Math.max(...ly, ...ay) + pitch)
        const ups = ly.filter((y, k) => y < ay[k]).length
        const rank = ly.map((_, k) => (k < ups ? k : n - 1 - k))
        const col = edge + s * (Math.max(...rank) * 9 + 14)
        kx = rank.map((r) => edge + s * r * 9)
        rs = stack.map(({ c }, k) => (s < 0 ? [col - c.w, ly[k] - c.h / 2, col, ly[k] + c.h / 2] : [col, ly[k] - c.h / 2, col + c.w, ly[k] + c.h / 2]))
      }
      let ok = true
      const before = { drawn: [...drawn], rects: [...rects] }
      stack.forEach((m, k) => {
        const r = rs[k]
        const end = stackBelow ? (s < 0 ? r[0] : r[2]) : s < 0 ? r[2] : r[0]
        const pts: P2[] = Math.abs(ly[k] - m.A[1]) < 1 ? [m.A, [end, ly[k]]] : [m.A, [kx[k], m.A[1]], [kx[k], ly[k]], [end, ly[k]]]
        const pad: Rect = [r[0] - 3, r[1] - 3, r[2] + 3, r[3] + 3]
        if (r[0] < avail.x || r[2] > labelR || r[1] < avail.y || r[3] > avail.y + avail.h + 24) ok = false
        else if (hulls.some((hl) => !m.own.has(hl.part) && covers(hl, pad)) || !clear(pts, (hl) => m.own.has(hl.part))) ok = false
        fixed.set(m, { pts, r, key: "stack", ly: ly[k], s })
        rects.push(r)
        keep(pts)
      })
      if (!ok) {
        fixed.clear()
        ;({ drawn, rects } = before)
      }
    }
    const free = live.filter((m) => !fixed.has(m))
    const base = { drawn, rects }
    const pass = (lean: number) => {
      drawn = [...base.drawn]
      rects = [...base.rects]
      // Leaning up, the stack is built from the bottom: the lowest label keeps its level.
      const dir = lean < 0 ? -1 : 1
      const lastY: Record<number, number> = { 1: -dir * 1e9, [-1]: -dir * 1e9 }
      const got: (Spot | null)[] = []
      let total = 0
      for (const { c, A: A0, own } of dir > 0 ? free : [...free].reverse()) {
        const { w, h } = c
        let best: Spot | null = null
        let bestCost = 1e18
        // The anchor first, then any spare anchors on the same part, at a small cost each.
        const anchorsOf: P2[] = [A0, ...(c.alt ?? []).map((v) => toPx(moved(c.part, v, off)))]
        for (const [ai, A] of anchorsOf.entries())
        for (const s of [c.side, -c.side])
          for (const e of [0, 18, 40, 70, 90, 110, 135, 160, 190, 220, 290])
            for (const v of e ? [-1, 1] : [0]) {
              const ly = A[1] + v * e
              if (dir * (ly - lastY[s]) < 4 || ly - h / 2 < F.y || ly + h / 2 > F.y + F.h) continue
              // Leg shapes: 0 a 45° knee, 1 vertical first, then orthogonal: level out by `up`
              // pixels, vertical, level again. The orthogonal ones reach a column on clean paper.
              for (const [run, up] of [14, 44, 100].flatMap((r) => (e ? [[r, 0], [r, 1], [r, 24], [r, 60], [r, 110], [r, 170]] : [[r, 0]]))) {
                const kx = A[0] + (up === 1 ? 0 : s * (up || e))
                const ex = kx + s * run
                const r: Rect = s > 0 ? [ex, ly - h / 2, ex + w, ly + h / 2] : [ex - w, ly - h / 2, ex, ly + h / 2]
                if (r[0] < F.x || r[2] > labelR) continue
                const key = `${ai} ${s} ${v * e} ${run} ${up}`
                let cost = ai * 30 + e * (up === 1 ? 1.8 : 1.5) + (up > 1 ? up * 0.9 + 12 : 0) + run * 0.8 + (s === c.side ? 0 : 80) + (v === -lean ? 2 * e : 0) - (key === c.pick ? 40 : 0)
                if (cost >= bestCost) continue
                if (rects.some((q) => meets(q, r, 6)) || drawn.some(([a, b]) => hits(poly(r), a, b))) continue
                // A label sits on paper, or at worst on a part it names (its paper ground is the
                // halo); never on a part it doesn't name.
                const pad: Rect = [r[0] - 3, r[1] - 3, r[2] + 3, r[3] + 3]
                let bad = false
                for (const hl of hulls)
                  if (covers(hl, pad)) {
                    if (!own.has(hl.part)) {
                      bad = true
                      break
                    }
                    cost += 150
                  }
                if (bad || cost >= bestCost) continue
                const pts: P2[] = !e ? [A, [ex, ly]] : up > 1 ? [A, [kx, A[1]], [kx, ly], [ex, ly]] : [A, [kx, ly], [ex, ly]]
                if (!clear(pts, (hl) => own.has(hl.part))) continue
                best = { pts, r, key, ly, s }
                bestCost = cost
              }
            }
        got.push(best)
        if (!best) continue
        total += bestCost
        lastY[best.s] = best.ly
        rects.push(best.r)
        keep(best.pts)
      }
      if (dir < 0) got.reverse()
      return { got, n: got.filter(Boolean).length, total }
    }
    let win = pass(0)
    for (const lean of [-1, 1]) {
      if (win.n === free.length) break
      const next = pass(lean)
      if (next.n > win.n || (next.n === win.n && next.total < win.total)) win = next
    }
    live.forEach((m) => {
      const { c } = m
      const best = fixed.get(m) ?? win.got[free.indexOf(m)]
      if (!best) return hide(c)
      c.pick = best.key
      c.e.style.display = "block"
      c.e.style.transform = `translate(${best.r[0]}px,${best.r[1]}px)`
      c.path.setAttribute("d", path(best.pts))
      c.dot.setAttribute("cx", String(best.pts[0][0]))
      c.dot.setAttribute("cy", String(best.pts[0][1]))
      c.dot.setAttribute("r", "2.6")
    })
  }

  /* ---------- frame loop ---------- */
  let raf = 0
  let last = 0
  let visible = true
  let lost = false
  let shown = false
  function invalidate() {
    if (!raf && visible && !document.hidden && !lost) raf = requestAnimationFrame(frame)
  }
  function frame(now: number) {
    raf = 0
    const dt = Math.min(64, now - last || 16)
    last = now
    const k = 1 - Math.exp(-dt / 95)
    const dp = T.p - S.p
    S.p += dp * (1 - Math.exp(-dt / 70))
    S.yaw += (T.yaw - S.yaw) * k
    S.pitch += (T.pitch - S.pitch) * k
    let moving = Math.abs(dp) > 0.0006 || Math.abs(T.yaw - S.yaw) > 0.0005 || Math.abs(T.pitch - S.pitch) > 0.0005
    const act = T.sel >= 0 ? T.sel : T.active
    for (let l = 0; l < LAYERS; l++) {
      const targets = [T.sel === l ? 1 : 0, act < 0 || act === l ? 1 : T.sel >= 0 ? 0.14 : 0.45, act === l ? 1 : 0]
      ;[S.iso, S.em, S.tint].forEach((arr, j) => {
        arr[l] += (targets[j] - arr[l]) * k
        if (Math.abs(targets[j] - arr[l]) > 0.002) moving = true
      })
      lay[l * 4] = S.em[l]
      lay[l * 4 + 1] = S.tint[l]
      lay[l * 4 + 2] = S.tint[l] * SHARED[l]
    }
    // A picked layer is shown as its own beat shows it: progress runs on to that beat if behind.
    let pe = S.p
    S.iso.forEach((t, l) => (pe += Math.max(0, l + 1 - pe) * t))
    pose(pe, S.iso, off, S.tint, spread())
    if (solveCamera(k)) moving = true
    drawOverlay()
    cam.left = L
    cam.right = L + W / Z
    cam.top = TOP
    cam.bottom = TOP - H / Z
    cam.position.set(view.d[0] * 80, view.d[1] * 80, view.d[2] * 80)
    cam.up.set(0, 1, 0)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
    lineU.uV.value.set(...view.d)
    renderer.render(scene, cam)
    stage.dataset.calls = String(renderer.info.render.calls)
    if (!shown) {
      shown = true
      o.onGl(true)
    }
    if (moving) invalidate()
  }

  /* ---------- input: drag rotates, tap picks a layer ---------- */
  let down: { id: number; x: number; y: number; yaw: number; pitch: number; t: number; touch: boolean; moved: boolean } | null = null
  function pick(cx: number, cy: number) {
    const sr = stage.getBoundingClientRect()
    const sx = (cx - sr.left) / Z + L
    const sy = TOP - (cy - sr.top) / Z
    const origin = [0, 1, 2].map((k) => view.r[k] * sx + view.u[k] * sy + view.d[k] * 80)
    const dir = view.d.map((v) => -v)
    let best = 1e9
    let hit = -1
    parts.forEach((pt, i) => {
      const a = moved(i, pt.min, off)
      const b = moved(i, pt.max, off)
      let t0 = -1e9
      let t1 = 1e9
      for (let k = 0; k < 3; k++) {
        if (Math.abs(dir[k]) < 1e-6) {
          if (origin[k] < a[k] || origin[k] > b[k]) return
          continue
        }
        let u = (a[k] - origin[k]) / dir[k]
        let v = (b[k] - origin[k]) / dir[k]
        if (u > v) [u, v] = [v, u]
        t0 = Math.max(t0, u)
        t1 = Math.min(t1, v)
        if (t0 > t1) return
      }
      if (t0 < best) {
        best = t0
        hit = pt.layer
      }
    })
    return hit
  }
  const onDown = (e: PointerEvent) => {
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: T.yaw, pitch: T.pitch, t: performance.now(), touch: e.pointerType === "touch", moved: false }
    if (!down.touch) canvas.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (!down || e.pointerId !== down.id) return
    const dx = e.clientX - down.x
    const dy = e.clientY - down.y
    if (Math.hypot(dx, dy) > 6) down.moved = true
    if (!down.moved) return
    T.yaw = clamp(down.yaw + dx * 0.0045, Math.max(0.12, yaw0() - 0.7), Math.min(1.3, yaw0() + 0.7))
    // Touch: vertical stays with native scroll (touch-action: pan-y).
    if (!down.touch) T.pitch = clamp(down.pitch + dy * 0.004, 0.16, 0.74)
    invalidate()
  }
  const onUp = (e: PointerEvent) => {
    if (down && !down.moved && performance.now() - down.t < 450) o.onPick(pick(e.clientX, e.clientY))
    down = null
  }
  const onCancel = () => (down = null)
  const onLost = (e: Event) => {
    e.preventDefault()
    lost = true
    shown = false
    cancelAnimationFrame(raf)
    raf = 0
    o.onGl(false)
  }
  const onRestored = () => {
    lost = false
    renderer.setClearColor(0xe4e8df, 1)
    measure()
  }
  const onVisibility = () => invalidate()

  canvas.addEventListener("pointerdown", onDown)
  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerup", onUp)
  canvas.addEventListener("pointercancel", onCancel)
  canvas.addEventListener("webglcontextlost", onLost)
  canvas.addEventListener("webglcontextrestored", onRestored)
  addEventListener("scroll", onScroll, { passive: true })
  document.addEventListener("visibilitychange", onVisibility)
  const ro = new ResizeObserver(measure)
  ro.observe(stage.parentElement ?? stage)
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting
    invalidate()
  })
  io.observe(stage)
  measure()

  return {
    select(layer) {
      T.sel = layer
      selY = scrollY
      invalidate()
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onCancel)
      canvas.removeEventListener("webglcontextlost", onLost)
      canvas.removeEventListener("webglcontextrestored", onRestored)
      fillGeo.dispose()
      lineGeo.dispose()
      mats.forEach((m) => m.dispose())
      renderer.dispose()
      overlay.replaceChildren()
      o.labels.replaceChildren()
      delete probe.velaHulls
      delete probe.velaAnchors
    },
  }
}
