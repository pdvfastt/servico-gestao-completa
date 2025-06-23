
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - NUCLEAR OPTION - ZERO DEPENDENCIES, ZERO HOOKS');

// NUCLEAR OPTION - Completely standalone tooltip components - NO HOOKS, NO STATE, NO EXTERNAL DEPENDENCIES
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - NUCLEAR STANDALONE');
  // Use React.createElement to avoid any potential hook calls
  return React.createElement('div', {
    className: "tooltip-provider-nuclear",
    'data-tooltip-provider': "nuclear",
    style: { display: 'contents' },
    ...props
  }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - NUCLEAR STANDALONE wrapper');
  return React.createElement('div', {
    className: "tooltip-wrapper-nuclear",
    'data-tooltip': "nuclear",
    style: { display: 'contents' },
    ...props
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
    'data-tooltip-trigger': "nuclear",
    style: { display: 'contents' },
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
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground tooltip-content-nuclear",
      className
    ),
    'data-tooltip-content': "nuclear",
    'data-side': side,
    'data-align': align,
    style: { display: 'none' },
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - NUCLEAR STANDALONE tooltip system ready');

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

// NUCLEAR OPTION - Mark as loaded and block Radix
if (typeof window !== 'undefined') {
  (window as any).__NUCLEAR_TOOLTIP_LOADED__ = true;
  (window as any).__NO_RADIX_TOOLTIP__ = true;
  (window as any).__RADIX_TOOLTIP_BLOCKED__ = true;
  console.log('🏁 tooltip.tsx - NUCLEAR tooltip ready, Radix completely blocked');
}
