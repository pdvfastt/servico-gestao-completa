
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading completely standalone tooltip implementation');

// Standalone tooltip implementation - no external dependencies
const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
  console.log('Standalone TooltipProvider rendering');
  return <div data-tooltip-provider="custom">{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('Standalone Tooltip rendering');
  return <div className="relative inline-block group" data-tooltip="custom">{children}</div>;
};

const TooltipTrigger = ({ children, asChild, ...props }: { 
  children: React.ReactNode; 
  asChild?: boolean; 
  [key: string]: any;
}) => {
  console.log('Standalone TooltipTrigger rendering');
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { 
      ...props,
      'data-tooltip-trigger': 'custom'
    });
  }
  return (
    <span {...props} data-tooltip-trigger="custom">
      {children}
    </span>
  );
};

const TooltipContent = ({ 
  children, 
  className, 
  sideOffset = 4, 
  side = "top", 
  align = "center", 
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  [key: string]: any;
}) => {
  console.log('Standalone TooltipContent rendering');
  
  return (
    <div 
      className={cn(
        "absolute z-50 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none opacity-0 invisible",
        "group-hover:opacity-100 group-hover:visible transition-opacity duration-200",
        side === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
        side === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-1",
        side === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-1",
        side === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-1",
        className
      )}
      data-tooltip-content="custom"
      {...props}
    >
      {children}
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
