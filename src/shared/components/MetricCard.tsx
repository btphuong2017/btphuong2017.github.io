import type { ReactNode } from "react"
import { cn } from "@/shared/utils/cn"

type MetricCardProps = {
  icon: ReactNode
  value: string
  label: string
  description?: string
  className?: string
}

export function MetricCard({
  icon,
  value,
  label,
  description,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/80 p-5 shadow-none transition-colors hover:border-border hover:bg-card/90",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/80 text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description ? (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default MetricCard
