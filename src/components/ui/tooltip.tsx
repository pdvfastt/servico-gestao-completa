
import * as React from "react"

// Simplified tooltip components that don't depend on Radix UI
const TooltipProvider = ({ 
  children, 
  delayDuration,
  skipDelayDuration,
  disableHoverableContent,
  ...props 
}: { 
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number; 
  disableHoverableContent?: boolean;
  [key: string]: any;
}) => {
  console.log('Using simplified TooltipProvider');
  return <>{children}</>;
};

const Tooltip = ({ 
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props 
}: { 
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: any;
}) => {
  console.log('Using simplified Tooltip');
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
    children: React.ReactNode;
  }
>(({ children, asChild, ...props }, ref) => {
  console.log('Using simplified TooltipTrigger');
  if (asChild && React.isValidElement(children)) {
    // Clone the child element and pass through props
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      ref
    });
  }
  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    align?: "start" | "center" | "end";
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionBoundary?: Element | null | Array<Element | null>;
    collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
    arrowPadding?: number;
    sticky?: "partial" | "always";
    hideWhenDetached?: boolean;
  }
>(({ children, side, sideOffset, align, className, ...props }, ref) => {
  console.log('Using simplified TooltipContent');
  return (
    <div 
      ref={ref} 
      className={`bg-black text-white text-sm rounded px-2 py-1 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
