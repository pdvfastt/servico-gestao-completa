
import * as React from "react"
import { cn } from "@/lib/utils"

// Simple custom tooltip implementation with proper React usage
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block group">{children}</div>;
};

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  { 
    children: React.ReactNode; 
    asChild?: boolean; 
    className?: string;
    [key: string]: any;
  }
>(({ children, asChild, className, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      ref,
      className: cn(className, 'cursor-pointer')
    });
  }
  
  return (
    <span 
      {...props} 
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cn(className, 'cursor-pointer')}
    >
      {children}
    </span>
  );
});

TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
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
        "absolute z-50 bg-gray-900 text-white text-sm rounded-md px-3 py-1.5 pointer-events-none",
        "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
        "transition-opacity duration-200 delay-300",
        "whitespace-nowrap",
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
      <div className={cn(
        "absolute w-2 h-2 bg-gray-900 transform rotate-45",
        side === "top" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
        side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
        side === "left" && "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
        side === "right" && "right-full top-1/2 translate-x-1/2 -translate-y-1/2"
      )} />
    </div>
  );
});

TooltipContent.displayName = "TooltipContent";
