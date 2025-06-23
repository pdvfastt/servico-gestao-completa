
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - NUCLEAR CUSTOM TOOLTIP - ZERO DEPENDENCIES');

// Completely custom tooltip components with ZERO external dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - NUCLEAR CUSTOM (NO RADIX, NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-provider-nuclear", 
    'data-tooltip-provider': 'nuclear-custom',
    style: { width: '100%', height: '100%' },
    ...props 
  }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - NUCLEAR CUSTOM wrapper (NO RADIX, NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-wrapper-nuclear",
    'data-tooltip': 'nuclear-custom',
    style: { display: 'contents' },
    ...props
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - NUCLEAR CUSTOM trigger (NO RADIX, NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-nuclear", className),
    'data-tooltip-trigger': 'nuclear-custom',
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
  console.log('✅ TooltipContent - NUCLEAR CUSTOM content (NO RADIX, NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 tooltip-content-nuclear",
      className
    ),
    'data-tooltip-content': 'nuclear-custom',
    'data-side': side,
    'data-align': align,
    style: { display: 'none' }, // Hidden by default since we're not implementing tooltip logic
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - NUCLEAR CUSTOM tooltip system ready - ZERO RADIX - ZERO HOOKS');

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
  Content: TooltipContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
};

console.log('🏁 tooltip.tsx - NUCLEAR CUSTOM tooltip marked as loaded - NO RADIX DEPENDENCY');
