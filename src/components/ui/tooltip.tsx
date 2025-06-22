
import * as React from "react"
import { cn } from "@/lib/utils"

// Try to import TooltipPrimitive, fall back to simple implementation if it fails
let TooltipPrimitive: any;
try {
  TooltipPrimitive = require("@radix-ui/react-tooltip");
} catch (error) {
  console.warn("Failed to load @radix-ui/react-tooltip, using fallback implementation");
  TooltipPrimitive = null;
}

// Fallback implementations
const FallbackTooltipProvider = ({ children, ...props }: { children: React.ReactNode; delayDuration?: number }) => (
  <div {...props}>{children}</div>
);

const FallbackTooltip = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">{children}</div>
);

const FallbackTooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean; children: React.ReactNode }
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { ...props, ref });
  }
  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>
      {children}
    </span>
  );
});
FallbackTooltipTrigger.displayName = "TooltipTrigger";

const FallbackTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }
>(({ children, className, sideOffset = 4, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "absolute z-50 bg-popover border rounded-md px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
FallbackTooltipContent.displayName = "TooltipContent";

// Export either Radix components or fallbacks
export const TooltipProvider = TooltipPrimitive?.Provider || FallbackTooltipProvider;
export const Tooltip = TooltipPrimitive?.Root || FallbackTooltip;
export const TooltipTrigger = TooltipPrimitive?.Trigger || FallbackTooltipTrigger;

export const TooltipContent = TooltipPrimitive?.Content ? 
  React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
  >(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )) : FallbackTooltipContent;
