import { Fragment, type ReactNode } from "react"

/**
 * Renders copy that uses `**bold**` markers (as authored in the locale
 * dictionaries) into text with <b> segments. No dangerouslySetInnerHTML.
 */
export function Rich({ text }: { text: string }): ReactNode {
  const parts = text.split("**")
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <b key={i}>{part}</b>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}
