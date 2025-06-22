
import * as React from "react"
import { cn } from "@/lib/utils"

// Simple tooltip implementation without external dependencies
const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => (
  <div>{children}</div>
);

const Tooltip = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">{children}</div>
);

const TooltipTrigger = React.forwardRef<
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
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    sideOffset?: number;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  }
>(({ children, className, sideOffset = 4, side = "top", align = "center", ...props }, ref) => (
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
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
