
import * as React from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ scroll-area.tsx - Standalone scroll area implementation with NO Radix dependencies');

// Completely standalone scroll area implementation with no external dependencies
const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal" | "both";
  }
>(({ className, children, orientation = "vertical", ...props }, ref) => {
  console.log('✅ ScrollArea - CUSTOM implementation with no Radix');
  
  const getScrollClasses = () => {
    switch (orientation) {
      case "horizontal":
        return "overflow-x-auto overflow-y-hidden";
      case "both":
        return "overflow-auto";
      default:
        return "overflow-y-auto overflow-x-hidden";
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        getScrollClasses(),
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
        className
      )}
      {...props}
    >
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";

// Standalone ScrollBar component for compatibility
const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal";
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  console.log('✅ ScrollBar - CUSTOM implementation for compatibility');
  
  // This is now just a visual component for compatibility
  return (
    <div
      ref={ref}
      className={cn(
        "absolute bg-gray-200 rounded",
        orientation === "vertical" ? "right-0 top-0 w-2 h-full" : "bottom-0 left-0 h-2 w-full",
        className
      )}
      style={{ display: 'none' }} // Hidden since we use CSS scrollbars
      {...props}
    />
  );
});
ScrollBar.displayName = "ScrollBar";

console.log('🎯 scroll-area.tsx - CUSTOM scroll area system ready - NO RADIX DEPENDENCIES');

export { ScrollArea, ScrollBar };

// Mark as completely custom implementation
(window as any).__CUSTOM_SCROLL_AREA_STANDALONE__ = true;
console.log('🏁 scroll-area.tsx - Custom scroll area marked as loaded');
