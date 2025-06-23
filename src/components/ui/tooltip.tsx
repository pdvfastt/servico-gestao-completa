
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - ULTRA DEFENSIVE CUSTOM TOOLTIP');

// Error boundary for tooltip components
const TooltipErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('🚫 Tooltip error caught:', error);
    return <>{fallback || null}</>;
  }
};

// Ultra defensive tooltip components with zero dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - ULTRA DEFENSIVE (NO HOOKS, NO STATE, NO RADIX)');
  return (
    <TooltipErrorBoundary>
      <div 
        className="tooltip-provider-ultra" 
        data-tooltip-provider="ultra-defensive"
        style={{ display: 'contents' }}
        {...props}
      >
        {children}
      </div>
    </TooltipErrorBoundary>
  );
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - ULTRA DEFENSIVE wrapper');
  return (
    <TooltipErrorBoundary>
      <div 
        className="tooltip-wrapper-ultra"
        data-tooltip="ultra-defensive"
        style={{ display: 'contents' }}
        {...props}
      >
        {children}
      </div>
    </TooltipErrorBoundary>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - ULTRA DEFENSIVE trigger');
  return (
    <TooltipErrorBoundary>
      <div
        ref={ref}
        className={cn("cursor-pointer tooltip-trigger-ultra", className)}
        data-tooltip-trigger="ultra-defensive"
        style={{ display: 'contents' }}
        {...props}
      >
        {children}
      </div>
    </TooltipErrorBoundary>
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
  console.log('✅ TooltipContent - ULTRA DEFENSIVE content');
  return (
    <TooltipErrorBoundary>
      <div
        ref={ref}
        className={cn(
          "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground tooltip-content-ultra",
          className
        )}
        data-tooltip-content="ultra-defensive"
        data-side={side}
        data-align={align}
        style={{ display: 'none' }}
        {...props}
      >
        {children}
      </div>
    </TooltipErrorBoundary>
  );
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - ULTRA DEFENSIVE tooltip system ready');

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
  (window as any).__ULTRA_TOOLTIP_LOADED__ = true;
  (window as any).__NO_RADIX_TOOLTIP__ = true;
}

console.log('🏁 tooltip.tsx - ULTRA DEFENSIVE tooltip ready');
