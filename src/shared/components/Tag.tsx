import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/shared/utils/cn"

export interface TagProps extends BadgeProps {}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="outline"
        className={cn(
          "border-border bg-background/60 text-xs font-normal text-muted-foreground",
          className,
        )}
        {...props}
      />
    )
  },
)

Tag.displayName = "Tag"

export default Tag

