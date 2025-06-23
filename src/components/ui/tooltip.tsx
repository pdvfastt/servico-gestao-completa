
import React from "react"
import { cn } from "@/lib/utils"

console.log('🔧 tooltip.tsx - Loading COMPLETELY ISOLATED tooltip implementation');

// Completely standalone tooltip components with no external dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - STANDALONE implementation without any hooks or dependencies');
  return React.createElement('div', { 
    className: "tooltip-provider-standalone", 
    'data-tooltip-provider': 'custom',
    ...props 
  }, children);
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ Tooltip - STANDALONE wrapper');
  return React.createElement('div', { 
    className: "tooltip-wrapper-standalone",
    'data-tooltip': 'custom'
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - STANDALONE trigger');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-standalone", className),
    'data-tooltip-trigger': 'custom',
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
  console.log('✅ TooltipContent - STANDALONE content');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 tooltip-content-standalone",
      className
    ),
    'data-tooltip-content': 'custom',
    'data-side': side,
    'data-align': align,
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - STANDALONE tooltip system ready - NO DEPENDENCIES, NO HOOKS');

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Mark as completely custom implementation
(window as any).__CUSTOM_TOOLTIP_STANDALONE__ = true;
console.log('🏁 tooltip.tsx - Standalone custom tooltip marked as loaded');
