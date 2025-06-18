import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        dark:
          "flex flex-row w-min-content items-center justify-center bg-primaryColor !font-semibold !text-mediumSize text-white border-light h-min-content py-0 px-3",
        leadDetails:
          "flex flex-row items-center justify-start bg-white gap-x-3 border-light h-24 w-1/3 pl-5",
        leadKeyword:
          "bg-white border-secondaryColor text-center px-4 py-2 rounded-xl",
        openBookmark:
          "flex flex-row !space-x-1 border-2 border-primaryColor bg-primaryColor text-white !text-primarySize !font-semibold px-2 py-1 cursor-pointer",
        closedBookmark:
          "flex flex-row !space-x-1 bg-none border border-light text-primaryColor !text-primarySize !font-semibold px-2 py-1 cursor-pointer",
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
