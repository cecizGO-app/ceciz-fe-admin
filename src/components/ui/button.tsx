import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[12px] border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-[#EC4899] focus-visible:ring-4 focus-visible:ring-[#EC4899]/24 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#EC4899] text-white hover:bg-[#DB2777] shadow-xs active:scale-[0.99]",
        outline:
          "border border-[#FBCFE8] bg-white text-[#18181B] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs",
        secondary:
          "bg-[#FFF5FA] text-[#EC4899] border border-[#FBCFE8]/80 hover:bg-[#FCE7F3]",
        ghost: "text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]",
        destructive:
          "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:text-rose-700",
        link: "text-[#EC4899] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-4 sm:px-5 rounded-[12px] text-xs sm:text-sm gap-2",
        xs: "h-6 px-2 rounded-[6px] text-[10px] gap-1 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 rounded-[8px] text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-6 rounded-[14px] text-sm font-bold gap-2.5",
        icon: "size-11 rounded-[12px]",
        "icon-sm":
          "size-8 rounded-[8px] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-6 rounded-[6px] [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-12 rounded-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
