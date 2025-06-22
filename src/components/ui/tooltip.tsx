
import React from "react"

// Temporarily simplified tooltip components to resolve React hooks issue
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>
const TooltipTrigger = React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>{children}</span>
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>{children}</div>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
