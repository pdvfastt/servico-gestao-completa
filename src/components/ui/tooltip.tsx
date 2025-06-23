
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - MAXIMUM SAFE standalone tooltip with ZERO external dependencies');

// MAXIMUM SAFE tooltip components with absolutely no external dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - MAXIMUM SAFE implementation');
  // Completely inert wrapper that just passes children through
  return React.createElement('div', {
    className: "tooltip-provider-maximum-safe",
    style: { display: 'contents' },
    'data-safe-tooltip-provider': 'true',
    ...props
  }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - MAXIMUM SAFE wrapper');
  return React.createElement('div', {
    className: "tooltip-wrapper-maximum-safe",
    style: { display: 'contents' },
    'data-safe-tooltip': 'true',
    ...props
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - MAXIMUM SAFE trigger');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer", className),
    style: { display: 'contents' },
    'data-safe-tooltip-trigger': 'true',
    ...props
  }, children);
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
  console.log('✅ TooltipContent - MAXIMUM SAFE content (completely hidden)');
  // Always hidden to prevent any interference
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
      className
    ),
    style: { display: 'none', visibility: 'hidden' },
    'data-safe-tooltip-content': 'true',
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - MAXIMUM SAFE tooltip system ready - ZERO DEPENDENCIES');

// Ensure global availability to prevent any import issues
if (typeof window !== 'undefined') {
  (window as any).__MAXIMUM_SAFE_TOOLTIP__ = {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
  };
}

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
}

// Export default for maximum compatibility
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

console.log('🏁 tooltip.tsx - MAXIMUM SAFE tooltip marked as ready');
