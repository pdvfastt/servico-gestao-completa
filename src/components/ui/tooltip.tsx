
import React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Complete fallback components that don't use any React hooks
const SafeTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-safe-tooltip-provider>{children}</div>;
};

const SafeTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div data-safe-tooltip>{children}</div>;
};

const SafeTooltipTrigger = ({ children, ...props }: any) => {
  return <div {...props} data-safe-tooltip-trigger>{children}</div>;
};

const SafeTooltipContent = ({ children, className, ...props }: any) => {
  return (
    <div 
      className={cn("hidden", className)} 
      {...props} 
      data-safe-tooltip-content
    >
      {children}
    </div>
  );
};

// Enhanced React stability check
const isReactFullyReady = () => {
  try {
    // Check if React exists and has all necessary methods
    if (!React || typeof React !== 'object') {
      console.log('TooltipProvider: React is not an object');
      return false;
    }

    // Check individual React methods
    const requiredMethods = ['useState', 'useEffect', 'createElement', 'forwardRef'];
    for (const method of requiredMethods) {
      if (typeof React[method] !== 'function') {
        console.log(`TooltipProvider: React.${method} is not a function`);
        return false;
      }
    }

    // Try to actually call useState to see if it works
    try {
      const testState = React.useState(null);
      if (!Array.isArray(testState) || testState.length !== 2) {
        console.log('TooltipProvider: useState test failed');
        return false;
      }
    } catch (error) {
      console.log('TooltipProvider: useState threw error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('TooltipProvider: React stability check failed:', error);
    return false;
  }
};

// Main TooltipProvider with comprehensive safety checks
const TooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  console.log('TooltipProvider: Rendering with React check');
  
  // Always use safe fallback if React is not ready
  if (!isReactFullyReady()) {
    console.log('TooltipProvider: Using safe fallback');
    return <SafeTooltipProvider>{children}</SafeTooltipProvider>;
  }
  
  // Only try Radix UI if React is completely stable
  try {
    console.log('TooltipProvider: Attempting to use Radix TooltipProvider');
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider: Radix error, using safe fallback:', error);
    return <SafeTooltipProvider>{children}</SafeTooltipProvider>;
  }
};

TooltipProvider.displayName = "TooltipProvider";

// Safe Tooltip wrapper
const Tooltip = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  if (!isReactFullyReady()) {
    return <SafeTooltip>{children}</SafeTooltip>;
  }
  
  try {
    return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
  } catch (error) {
    console.error('Tooltip: Radix error, using safe fallback:', error);
    return <SafeTooltip>{children}</SafeTooltip>;
  }
};

// Safe TooltipTrigger wrapper
const TooltipTrigger = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) => {
  if (!isReactFullyReady()) {
    return <SafeTooltipTrigger {...props}>{children}</SafeTooltipTrigger>;
  }
  
  try {
    return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>;
  } catch (error) {
    console.error('TooltipTrigger: Radix error, using safe fallback:', error);
    return <SafeTooltipTrigger {...props}>{children}</SafeTooltipTrigger>;
  }
};

// Safe TooltipContent wrapper
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  if (!isReactFullyReady()) {
    return <SafeTooltipContent className={className} {...props} />;
  }
  
  try {
    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    );
  } catch (error) {
    console.error('TooltipContent: Radix error, using safe fallback:', error);
    return <SafeTooltipContent className={className} {...props} />;
  }
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
