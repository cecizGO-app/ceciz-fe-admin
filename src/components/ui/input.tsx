import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: "default" | "sm" }) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "w-full min-w-0 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] placeholder:text-[#71717A] transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground focus-visible:border-[#EC4899] focus-visible:ring-4 focus-visible:ring-[#EC4899]/24 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-[#71717A] read-only:bg-zinc-50 read-only:text-[#71717A] read-only:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20",
        size === "default" ? "h-11 px-3.5" : "h-8 px-2.5",
        className
      )}
      {...props}
    />
  )
}

export { Input }
