"use client"

import { useEffect, useState, type ReactNode } from "react"
import type { Line } from "@/content/career"
import type { Messages } from "@/messages"
import styles from "./map.module.css"

type Choice = Line | "both"
const choices: Choice[] = ["both", "inside", "outside"]

/** "View by line": dims the other line and its words. Hidden until JS runs; the map reads without it. */
export function LineChoice({ m, children }: { m: Messages["map"]; children: ReactNode }) {
  const [line, setLine] = useState<Choice>("both")
  const [ready, setReady] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- shows the control only once it works
  useEffect(() => setReady(true), [])
  return (
    // Chrome doesn't scroll a focused SVG link into view, in the map's strip or on the page.
    <div
      className={styles.map}
      data-line={line}
      onFocus={(e) => e.target instanceof SVGElement && e.target.scrollIntoView({ block: "nearest", inline: "nearest" })}
    >
      <div className={styles.choice} role="group" aria-labelledby="line-choice" hidden={!ready}>
        <p id="line-choice">{m.choose}</p>
        {choices.map((c) => (
          <button key={c} type="button" className={styles[`pick_${c}`]} aria-pressed={line === c} onClick={() => setLine(c)}>
            {m.lines[c]}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}
