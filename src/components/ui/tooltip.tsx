
import React from "react"
import { cn } from "@/lib/utils"

console.log('🔧 tooltip.tsx - Loading MINIMAL custom tooltip implementation');

// Absolutely minimal tooltip components - no hooks, no external dependencies
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - SAFE implementation rendering without hooks');
  return React.createElement('div', { className: "tooltip-provider", ...props }, children);
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ Tooltip - SAFE wrapper rendering');
  return React.createElement('div', { className: "tooltip-wrapper" }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - SAFE trigger rendering');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer", className),
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
  console.log('✅ TooltipContent - SAFE content rendering');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
      className
    ),
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - All SAFE exports ready without any hooks or external dependencies');

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Explicitly mark this as our custom implementation
(window as any).__CUSTOM_TOOLTIP_LOADED__ = true;
console.log('🏁 tooltip.tsx - Custom tooltip implementation marked as loaded');
