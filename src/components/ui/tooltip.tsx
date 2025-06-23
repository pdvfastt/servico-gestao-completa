
import React from "react"
import { cn } from "@/lib/utils"

// Completely safe tooltip components that don't use any external libraries
const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="tooltip-provider">{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="tooltip-wrapper">{children}</div>;
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("cursor-pointer", className)} 
      {...props}
    >
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
