
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading simple tooltip - avoiding all Radix conflicts');

// Simple tooltip implementation with different names to avoid conflicts
const SimpleTooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
  console.log('SimpleTooltipProvider rendering');
  return <>{children}</>;
};

const SimpleTooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('SimpleTooltip rendering');
  return <div className="relative inline-block group">{children}</div>;
};

const SimpleTooltipTrigger = ({ children, asChild, ...props }: { 
  children: React.ReactNode; 
  asChild?: boolean; 
  [key: string]: any;
}) => {
  console.log('SimpleTooltipTrigger rendering');
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, props);
  }
  return <span {...props}>{children}</span>;
};

const SimpleTooltipContent = ({ 
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
  console.log('SimpleTooltipContent rendering');
  
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
      {...props}
    >
      {children}
    </div>
  );
};

// Export with original names for compatibility
export { 
  SimpleTooltipProvider as TooltipProvider,
  SimpleTooltip as Tooltip, 
  SimpleTooltipTrigger as TooltipTrigger, 
  SimpleTooltipContent as TooltipContent 
};
