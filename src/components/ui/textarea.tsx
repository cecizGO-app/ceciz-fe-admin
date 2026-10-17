import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-[12px] border border-[#FBCFE8] bg-white px-3.5 py-2.5 text-xs font-medium text-[#18181B] placeholder:text-[#71717A] transition-all outline-none focus-visible:border-[#EC4899] focus-visible:ring-4 focus-visible:ring-[#EC4899]/24 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-[#71717A] disabled:opacity-75 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
