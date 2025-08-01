import { forwardRef } from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = "Label"

export { Label }
