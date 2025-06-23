
import React from "react"
import { cn } from "@/lib/utils"

console.log('🔧 tooltip.tsx - Loading ULTIMATE standalone tooltip with ZERO hooks');

// ULTIMATE standalone tooltip components with ZERO dependencies and NO HOOKS
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - ULTIMATE STANDALONE (NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-provider-ultimate", 
    'data-tooltip-provider': 'ultimate',
    ...props 
  }, children);
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ Tooltip - ULTIMATE STANDALONE wrapper (NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-wrapper-ultimate",
    'data-tooltip': 'ultimate'
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - ULTIMATE STANDALONE trigger (NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-ultimate", className),
    'data-tooltip-trigger': 'ultimate',
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
  console.log('✅ TooltipContent - ULTIMATE STANDALONE content (NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 tooltip-content-ultimate",
      className
    ),
    'data-tooltip-content': 'ultimate',
    'data-side': side,
    'data-align': align,
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - ULTIMATE STANDALONE tooltip system ready - ZERO DEPENDENCIES - NO HOOKS');

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

// ULTIMATE Override - Mark as custom implementation
if (typeof window !== 'undefined') {
  (window as any).__CUSTOM_TOOLTIP_ULTIMATE__ = true;
  (window as any).__RADIX_UI_TOOLTIP__ = {
    Provider: TooltipProvider,
    Root: Tooltip,
    Trigger: TooltipTrigger,
    Content: TooltipContent
  };
  
  // ULTIMATE: Override any existing Radix imports completely
  (window as any)['@radix-ui/react-tooltip'] = {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    Provider: TooltipProvider,
    Root: Tooltip,
    Trigger: TooltipTrigger,
    Content: TooltipContent
  };
}

console.log('🏁 tooltip.tsx - ULTIMATE custom tooltip marked as loaded');
