
import React from "react"

console.log('🛡️ tooltip.tsx - NUCLEAR SAFE tooltip components');

// NUCLEAR SAFE tooltip components - completely inert
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ TooltipProvider - NUCLEAR SAFE (inert passthrough)');
  return React.createElement('div', { style: { display: 'contents' } }, children);
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  console.log('✅ Tooltip - NUCLEAR SAFE (inert passthrough)');
  return React.createElement('div', { style: { display: 'contents' } }, children);
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, ...props }, ref) => {
  console.log('✅ TooltipTrigger - NUCLEAR SAFE (inert passthrough)');
  return React.createElement('div', { ref, style: { display: 'contents' } }, children);
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
>(({ children, ...props }, ref) => {
  console.log('✅ TooltipContent - NUCLEAR SAFE (always null)');
  return null;
});
TooltipContent.displayName = "TooltipContent";

console.log('🎯 tooltip.tsx - NUCLEAR SAFE tooltip system ready');

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
