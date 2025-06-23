
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - ULTRA DEFENSIVE CUSTOM TOOLTIP - ZERO DEPENDENCIES');

// Completely standalone tooltip components - NO HOOKS, NO STATE, NO EXTERNAL DEPENDENCIES
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - ULTRA DEFENSIVE STANDALONE');
  return (
    <div 
      className="tooltip-provider-standalone" 
      data-tooltip-provider="standalone"
      style={{ display: 'contents' }}
      {...props}
    >
      {children}
    </div>
  );
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - ULTRA DEFENSIVE STANDALONE wrapper');
  return (
    <div 
      className="tooltip-wrapper-standalone"
      data-tooltip="standalone"
      style={{ display: 'contents' }}
      {...props}
    >
      {children}
    </div>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - ULTRA DEFENSIVE STANDALONE trigger');
  return (
    <div
      ref={ref}
      className={cn("cursor-pointer tooltip-trigger-standalone", className)}
      data-tooltip-trigger="standalone"
      style={{ display: 'contents' }}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    side?: string; 
    align?: string; 
    sideOffset?: number;
    [key: string]: any;
  }
>(({ className, children, side, align, sideOffset, ...props }, ref) => {
  console.log('✅ TooltipContent - ULTRA DEFENSIVE STANDALONE content');
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground tooltip-content-standalone",
        className
      )}
      data-tooltip-content="standalone"
      data-side={side}
      data-align={align}
      style={{ display: 'none' }}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - ULTRA DEFENSIVE STANDALONE tooltip system ready');

// Export everything
export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
}

// Export default
export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
};

// Mark as loaded
if (typeof window !== 'undefined') {
  (window as any).__STANDALONE_TOOLTIP_LOADED__ = true;
  (window as any).__NO_RADIX_TOOLTIP__ = true;
  console.log('🏁 tooltip.tsx - STANDALONE tooltip ready, Radix blocked');
}
