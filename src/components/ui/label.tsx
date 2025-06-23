
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

console.log('🛡️ label.tsx - STANDALONE label implementation with NO Radix dependencies');

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => {
  console.log('✅ Label - STANDALONE implementation with no Radix');
  
  return (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
});
Label.displayName = "Label";

console.log('🎯 label.tsx - STANDALONE label system ready - NO RADIX DEPENDENCIES');

export { Label };

// Mark as completely standalone implementation
(window as any).__STANDALONE_LABEL__ = true;
console.log('🏁 label.tsx - Standalone label marked as loaded');
