
import React from "react"

// Temporarily simplified tooltip components to resolve React hooks issue
const TooltipProvider = ({ children, delayDuration, ...props }: { 
  children: React.ReactNode; 
  delayDuration?: number;
  [key: string]: any;
}) => <>{children}</>

const Tooltip = ({ children, ...props }: { 
  children: React.ReactNode;
  [key: string]: any;
}) => <>{children}</>

const TooltipTrigger = React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>{children}</span>
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>{children}</div>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
