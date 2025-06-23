
import React from "react"
import { cn } from "@/lib/utils"

// Safe, simple tooltip components that don't rely on external libraries
const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-tooltip-provider>{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div data-tooltip>{children}</div>;
};

const TooltipTrigger = ({ children, className, ...props }: any) => {
  return (
    <div 
      className={cn("cursor-pointer", className)} 
      {...props} 
      data-tooltip-trigger
    >
      {children}
    </div>
  );
};

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("hidden", className)} 
      {...props} 
      data-tooltip-content
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
