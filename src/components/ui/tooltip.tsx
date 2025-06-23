
import React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tooltip.tsx - Safe tooltip implementation (no Radix dependency)');

// Safe tooltip components - completely standalone
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - Safe implementation');
  return React.createElement('div', {
    className: "tooltip-provider-safe",
    'data-tooltip-provider': "safe",
    style: { display: 'contents' },
    ...props
  }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - Safe wrapper');
  return React.createElement('div', {
    className: "tooltip-wrapper-safe",
    'data-tooltip': "safe",
    style: { display: 'contents' },
    ...props
  }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  console.log('✅ TooltipTrigger - Safe trigger');
  return React.createElement('div', {
    ref,
    className: cn("cursor-pointer tooltip-trigger-safe", className),
    'data-tooltip-trigger': "safe",
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
  console.log('✅ TooltipContent - Safe content (hidden)');
  return React.createElement('div', {
    ref,
    className: cn(
      "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground tooltip-content-safe",
      className
    ),
    'data-tooltip-content': "safe",
    'data-side': side,
    'data-align': align,
    style: { display: 'none' },
    ...props
  }, children);
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - Safe tooltip system ready');

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
}

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
