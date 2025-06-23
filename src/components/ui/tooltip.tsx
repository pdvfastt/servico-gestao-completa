
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading clean custom tooltip implementation - no Radix dependencies');

// Completely custom tooltip implementation - no external dependencies
const CustomTooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
  console.log('CustomTooltipProvider rendering');
  return <React.Fragment>{children}</React.Fragment>;
};

const CustomTooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('CustomTooltip rendering');
  return <div className="relative inline-block group tooltip-container">{children}</div>;
};

const CustomTooltipTrigger = ({ children, asChild, ...props }: { 
  children: React.ReactNode; 
  asChild?: boolean; 
  [key: string]: any;
}) => {
  console.log('CustomTooltipTrigger rendering');
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      className: cn(props.className, 'tooltip-trigger')
    });
  }
  return <span {...props} className={cn(props.className, 'tooltip-trigger')}>{children}</span>;
};

const CustomTooltipContent = ({ 
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
  console.log('CustomTooltipContent rendering');
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1", 
    left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-1"
  };
  
  return (
    <div 
      className={cn(
        "absolute z-50 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none opacity-0 invisible",
        "group-hover:opacity-100 group-hover:visible transition-opacity duration-200",
        "tooltip-content",
        positionClasses[side],
        className
      )}
      style={{ 
        marginTop: side === 'bottom' ? sideOffset : undefined,
        marginBottom: side === 'top' ? sideOffset : undefined,
        marginLeft: side === 'right' ? sideOffset : undefined,
        marginRight: side === 'left' ? sideOffset : undefined
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Export with standard names for compatibility
export { 
  CustomTooltipProvider as TooltipProvider,
  CustomTooltip as Tooltip, 
  CustomTooltipTrigger as TooltipTrigger, 
  CustomTooltipContent as TooltipContent 
};
