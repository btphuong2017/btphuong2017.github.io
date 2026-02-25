import type { ReactNode } from "react"

import { cn } from "@/shared/utils/cn"

type SectionHeaderAlign = "left" | "center"

interface SectionHeaderProps {
  label?: string
  icon?: ReactNode
  title: string
  description?: string
  align?: SectionHeaderAlign
  className?: string
}

export function SectionHeader({
  label,
  icon,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center"

  return (
    <div
      className={cn(
        "space-y-3",
        isCentered ? "text-center md:mx-auto" : "text-left",
        "max-w-2xl",
        className,
      )}
    >
      {label ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border",
            "bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground",
            isCentered && "justify-center",
          )}
        >
          {icon}
          <span>{label}</span>
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeader

