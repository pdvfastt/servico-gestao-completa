
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - COMPLETELY STANDALONE - NO HOOKS');

// Completely standalone tooltip components with ZERO dependencies and NO HOOKS
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - STANDALONE (NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-provider-standalone", 
    'data-tooltip-provider': 'standalone',
    style: { width: '100%', height: '100%' },
    ...props 
  }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - STANDALONE wrapper (NO HOOKS)');
  return React.createElement('div', { 
    className: "tooltip-wrapper-standalone",
    'data-tooltip': 'standalone',
    style: { display: 'contents' },
    ...props
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - STANDALONE trigger (NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-standalone", className),
    'data-tooltip-trigger': 'standalone',
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
  console.log('✅ TooltipContent - STANDALONE content (NO HOOKS)');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 tooltip-content-standalone",
      className
    ),
    'data-tooltip-content': 'standalone',
    'data-side': side,
    'data-align': align,
    style: { display: 'none' }, // Hidden by default since we're not implementing tooltip logic
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - STANDALONE tooltip system ready - ZERO DEPENDENCIES - NO HOOKS');

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

console.log('🏁 tooltip.tsx - STANDALONE custom tooltip marked as loaded');
