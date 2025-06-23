
import React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Debug React availability
console.log('Tooltip component - React available:', !!React);
console.log('Tooltip component - React version:', React?.version);

// Create a safe wrapper that completely avoids Radix until React is ready
const TooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  console.log('TooltipProvider rendering - React available:', !!React);
  console.log('TooltipProvider rendering - React.useState available:', !!React?.useState);
  console.log('TooltipProvider rendering - globalThis.React available:', !!(globalThis as any)?.React);
  console.log('TooltipProvider rendering - window.React available:', !!(window as any)?.React);
  
  // Multiple safety checks to ensure React is fully available
  const isReactReady = React && 
                      React.useState && 
                      React.useEffect && 
                      ((globalThis as any)?.React || (window as any)?.React);
  
  if (!isReactReady) {
    console.error('TooltipProvider: React is not fully available, rendering children in a div');
    // Return a simple div wrapper when React isn't ready
    return React?.createElement ? React.createElement('div', {}, children) : <div>{children}</div>;
  }
  
  // Only use Radix TooltipProvider when React is fully available
  try {
    console.log('TooltipProvider: Using Radix TooltipProvider');
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider: Error with Radix TooltipProvider, falling back to div:', error);
    return <div>{children}</div>;
  }
};

TooltipProvider.displayName = "TooltipProvider";

// Safe wrapper for Tooltip that doesn't use Radix when React isn't ready
const Tooltip = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  const isReactReady = React && React.useState && ((globalThis as any)?.React || (window as any)?.React);
  
  if (!isReactReady) {
    console.log('Tooltip: React not ready, rendering children directly');
    return <div>{children}</div>;
  }
  
  try {
    return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
  } catch (error) {
    console.error('Tooltip: Error with Radix Tooltip, falling back to div:', error);
    return <div>{children}</div>;
  }
};

// Safe wrapper for TooltipTrigger
const TooltipTrigger = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) => {
  const isReactReady = React && React.useState && ((globalThis as any)?.React || (window as any)?.React);
  
  if (!isReactReady) {
    return <div>{children}</div>;
  }
  
  try {
    return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>;
  } catch (error) {
    console.error('TooltipTrigger: Error with Radix TooltipTrigger, falling back to div:', error);
    return <div>{children}</div>;
  }
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const isReactReady = React && React.useState && ((globalThis as any)?.React || (window as any)?.React);
  
  if (!isReactReady) {
    return <div className={className} {...props} />;
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
    console.error('TooltipContent: Error with Radix TooltipContent, falling back to div:', error);
    return <div className={className} {...props} />;
  }
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
