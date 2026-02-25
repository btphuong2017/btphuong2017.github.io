import * as React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/shared/utils/cn"

export type ContentCardProps = React.ComponentProps<"div">

export function ContentCard({ className, ...props }: ContentCardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border border-border bg-card/80 shadow-none",
        className,
      )}
      {...props}
    />
  )
}

export default ContentCard

