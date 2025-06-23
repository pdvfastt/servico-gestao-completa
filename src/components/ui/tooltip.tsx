
import React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Simple fallback tooltip that doesn't use Radix UI
const SimpleTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="simple-tooltip-provider">{children}</div>;
};

const SimpleTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="simple-tooltip">{children}</div>;
};

const SimpleTooltipTrigger = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

const SimpleTooltipContent = ({ children, className, ...props }: any) => {
  return <div className={cn("simple-tooltip-content", className)} {...props}>{children}</div>;
};

// Check if React is fully available and stable
const isReactStable = () => {
  try {
    // Multiple checks to ensure React is completely ready
    return !!(
      React &&
      React.useState &&
      React.useEffect &&
      React.createElement &&
      typeof React.useState === 'function' &&
      typeof React.useEffect === 'function' &&
      typeof React.createElement === 'function' &&
      ((globalThis as any)?.React || (window as any)?.React)
    );
  } catch (error) {
    console.error('React stability check failed:', error);
    return false;
  }
};

// Safe TooltipProvider that completely avoids Radix UI when React isn't ready
const TooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  console.log('TooltipProvider: Checking React stability');
  
  if (!isReactStable()) {
    console.log('TooltipProvider: React not stable, using simple fallback');
    return <SimpleTooltipProvider>{children}</SimpleTooltipProvider>;
  }
  
  try {
    console.log('TooltipProvider: Using Radix TooltipProvider');
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider: Radix error, falling back to simple provider:', error);
    return <SimpleTooltipProvider>{children}</SimpleTooltipProvider>;
  }
};

TooltipProvider.displayName = "TooltipProvider";

// Safe Tooltip wrapper
const Tooltip = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  if (!isReactStable()) {
    return <SimpleTooltip>{children}</SimpleTooltip>;
  }
  
  try {
    return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
  } catch (error) {
    console.error('Tooltip: Radix error, falling back to simple tooltip:', error);
    return <SimpleTooltip>{children}</SimpleTooltip>;
  }
};

// Safe TooltipTrigger wrapper
const TooltipTrigger = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) => {
  if (!isReactStable()) {
    return <SimpleTooltipTrigger {...props}>{children}</SimpleTooltipTrigger>;
  }
  
  try {
    return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>;
  } catch (error) {
    console.error('TooltipTrigger: Radix error, falling back to simple trigger:', error);
    return <SimpleTooltipTrigger {...props}>{children}</SimpleTooltipTrigger>;
  }
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  if (!isReactStable()) {
    return <SimpleTooltipContent className={className} {...props} />;
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
    console.error('TooltipContent: Radix error, falling back to simple content:', error);
    return <SimpleTooltipContent className={className} {...props} />;
  }
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
