"use client"

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react"

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Delay before revealing, in ms (used for staggered platform-map cells). */
  delay?: number
  id?: string
}

/**
 * One-shot scroll reveal via IntersectionObserver (threshold 0.15).
 * Adds `.in` when the element enters the viewport. Motion is disabled via
 * CSS for `prefers-reduced-motion: reduce`, so no JS branch is needed.
 */
export function Reveal({
  children,
  as,
  className,
  delay = 0,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const Tag = (as ?? "div") as ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveal = () => el.classList.add("in")
            if (delay) {
              const timer = window.setTimeout(reveal, delay)
              el.dataset.revealTimer = String(timer)
            } else {
              reveal()
            }
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} id={id} className={["reveal", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  )
}
