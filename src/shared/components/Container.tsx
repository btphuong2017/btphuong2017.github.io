import { cn } from "@/shared/utils/cn"

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("container mx-auto max-w-screen-2xl px-4", className)}
      {...props}
    />
  )
}

export default Container
