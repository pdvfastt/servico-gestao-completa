
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading enhanced custom tooltip implementation');

// Simple custom tooltip implementation without external dependencies
const CustomTooltipProvider = ({ children, delayDuration = 0 }: { 
  children: React.ReactNode; 
  delayDuration?: number;
}) => {
  console.log('CustomTooltipProvider rendering');
  return <React.Fragment>{children}</React.Fragment>;
};

const CustomTooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('CustomTooltip rendering');
  return <div className="relative inline-block group tooltip-container">{children}</div>;
};

const CustomTooltipTrigger = React.forwardRef<
  HTMLElement,
  { 
    children: React.ReactNode; 
    asChild?: boolean; 
    className?: string;
    [key: string]: any;
  }
>(({ children, asChild, className, ...props }, ref) => {
  console.log('CustomTooltipTrigger rendering');
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      ref,
      className: cn(className, 'tooltip-trigger')
    });
  }
  
  return (
    <span 
      {...props} 
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cn(className, 'tooltip-trigger')}
    >
      {children}
    </span>
  );
});

CustomTooltipTrigger.displayName = "CustomTooltipTrigger";

const CustomTooltipContent = React.forwardRef<
  HTMLDivElement,
  { 
    children: React.ReactNode;
    className?: string;
    sideOffset?: number;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    [key: string]: any;
  }
>(({ 
  children, 
  className, 
  sideOffset = 4, 
  side = "top", 
  align = "center", 
  ...props 
}, ref) => {
  console.log('CustomTooltipContent rendering');
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1", 
    left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-1"
  };
  
  return (
    <div 
      ref={ref}
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
});

CustomTooltipContent.displayName = "CustomTooltipContent";

// Export with standard names for compatibility
export { 
  CustomTooltipProvider as TooltipProvider,
  CustomTooltip as Tooltip, 
  CustomTooltipTrigger as TooltipTrigger, 
  CustomTooltipContent as TooltipContent 
};
