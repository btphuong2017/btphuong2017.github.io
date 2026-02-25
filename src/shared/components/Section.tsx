import { cn } from "@/shared/utils/cn"

export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "py-12 md:py-16 lg:py-20",
        "border-t border-border/60 first:border-t-0",
        className,
      )}
      {...props}
    />
  )
}

export default Section
