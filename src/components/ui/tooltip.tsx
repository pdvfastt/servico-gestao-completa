
import React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Debug React availability
console.log('Tooltip component - React available:', !!React);
console.log('Tooltip component - React version:', React?.version);

// Create a completely safe TooltipProvider that doesn't use Radix until React is ready
const TooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  console.log('TooltipProvider rendering - React available:', !!React);
  console.log('TooltipProvider rendering - React.useState available:', !!React?.useState);
  
  // If React or useState is not available, render children without tooltip functionality
  if (!React || !React.useState) {
    console.error('TooltipProvider: React or React.useState is not available, rendering children without tooltip');
    return <div>{children}</div>;
  }
  
  // Only use the Radix TooltipProvider when React is fully available
  try {
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider: Error with Radix TooltipProvider, falling back to div:', error);
    return <div>{children}</div>;
  }
};

TooltipProvider.displayName = "TooltipProvider";

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
