
import React from "react"
import { cn } from "@/lib/utils"

console.log('🔧 tooltip.tsx - Loading NUCLEAR ISOLATED tooltip implementation');

// NUCLEAR standalone tooltip components with ZERO external dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - NUCLEAR STANDALONE implementation');
  return React.createElement('div', { 
    className: "tooltip-provider-nuclear", 
    'data-tooltip-provider': 'nuclear',
    ...props 
  }, children);
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ Tooltip - NUCLEAR STANDALONE wrapper');
  return React.createElement('div', { 
    className: "tooltip-wrapper-nuclear",
    'data-tooltip': 'nuclear'
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - NUCLEAR STANDALONE trigger');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-nuclear", className),
    'data-tooltip-trigger': 'nuclear',
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
  console.log('✅ TooltipContent - NUCLEAR STANDALONE content');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 tooltip-content-nuclear",
      className
    ),
    'data-tooltip-content': 'nuclear',
    'data-side': side,
    'data-align': align,
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - NUCLEAR STANDALONE tooltip system ready - ZERO DEPENDENCIES');

// Export everything that Radix would export
export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
}

// Export default for any default imports
export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent
};

// Mark as NUCLEAR custom implementation
(window as any).__CUSTOM_TOOLTIP_NUCLEAR__ = true;
console.log('🏁 tooltip.tsx - NUCLEAR custom tooltip marked as loaded');

// Override any global Radix references
if (typeof window !== 'undefined') {
  (window as any).__RADIX_UI_TOOLTIP__ = {
    Provider: TooltipProvider,
    Root: Tooltip,
    Trigger: TooltipTrigger,
    Content: TooltipContent
  };
}
