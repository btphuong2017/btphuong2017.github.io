import * as React from "react"

import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/shared/utils/cn"

export interface ContentCardProps extends CardProps {}

export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card/80 shadow-none",
          className,
        )}
        {...props}
      />
    )
  },
)

ContentCard.displayName = "ContentCard"

export default ContentCard

