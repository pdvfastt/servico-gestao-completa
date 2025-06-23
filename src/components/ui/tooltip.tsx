
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading minimal custom tooltip implementation');

// Minimal tooltip implementation
const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
  console.log('Minimal TooltipProvider rendering');
  return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('Minimal Tooltip rendering');
  return <div className="relative inline-block">{children}</div>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean; children: React.ReactNode }
>(({ children, asChild, ...props }, ref) => {
  console.log('Minimal TooltipTrigger rendering');
  
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
>(({ children, className, sideOffset = 4, side = "top", align = "center", ...props }, ref) => {
  console.log('Minimal TooltipContent rendering');
  
  return (
    <div 
      ref={ref} 
      className={cn(
        "absolute z-50 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none opacity-0 invisible",
        "group-hover:opacity-100 group-hover:visible transition-opacity",
        side === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
        side === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-1",
        side === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-1",
        side === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
