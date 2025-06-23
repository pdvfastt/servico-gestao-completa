
import React from "react"
import { cn } from "@/lib/utils"

console.log('tooltip.tsx - Loading custom tooltip implementation');

// Completely safe tooltip components that don't use any external libraries
const TooltipProvider = ({ 
  children, 
  delayDuration, 
  ...props 
}: { 
  children: React.ReactNode; 
  delayDuration?: number;
  [key: string]: any;
}) => {
  console.log('TooltipProvider - Custom implementation loaded');
  return <div className="tooltip-provider" {...props}>{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="tooltip-wrapper">{children}</div>;
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, className, asChild, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("cursor-pointer", className)} 
      {...props}
    >
      {children}
    </div>
  );
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
  return (
    <div 
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

// Export all the components that Radix UI would export
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

// Also export as default for any default imports
export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
};

console.log('tooltip.tsx - All exports ready');
