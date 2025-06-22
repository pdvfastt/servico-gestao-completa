
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('Loading ONLY custom tooltip - NO Radix UI');

// Completely custom tooltip implementation - no external dependencies
const TooltipProvider = ({ children, delayDuration }: { children: React.ReactNode; delayDuration?: number }) => {
  console.log('Custom TooltipProvider rendering - should see this');
  return <>{children}</>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  console.log('Custom Tooltip component rendering');
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen });
        }
        return child;
      })}
    </div>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean; children: React.ReactNode }
>(({ children, asChild, ...props }, ref) => {
  console.log('Custom TooltipTrigger rendering');
  
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
    isOpen?: boolean;
  }
>(({ children, className, sideOffset = 4, side = "top", align = "center", isOpen = false, ...props }, ref) => {
  console.log('Custom TooltipContent rendering, isOpen:', isOpen);
  
  if (!isOpen) return null;
  
  const getPositionClasses = () => {
    const baseClasses = "absolute z-50 bg-popover border rounded-md px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95";
    
    switch (side) {
      case "top":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-${sideOffset}`;
      case "bottom":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-${sideOffset}`;
      case "left":
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-${sideOffset}`;
      case "right":
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-${sideOffset}`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-${sideOffset}`;
    }
  };

  return (
    <div 
      ref={ref} 
      className={cn(getPositionClasses(), className)}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

// Export our custom components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
