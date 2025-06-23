
import React, { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

console.log('🛡️ tabs.tsx - STANDALONE tabs implementation with NO Radix dependencies');

// Context for managing tabs state
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// Root Tabs component
interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const Tabs = ({ defaultValue, value, onValueChange, className, children }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  console.log('✅ Tabs - STANDALONE implementation with no Radix');

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// TabsList component
interface TabsListProps {
  className?: string
  children: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
)
TabsList.displayName = "TabsList"

// TabsTrigger component
interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children }, ref) => {
    const { value: currentValue, onValueChange } = useTabsContext()
    const isActive = currentValue === value

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:bg-background/50",
          className
        )}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

// TabsContent component
interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children }, ref) => {
    const { value: currentValue } = useTabsContext()
    
    if (currentValue !== value) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

console.log('🎯 tabs.tsx - STANDALONE tabs system ready - NO RADIX DEPENDENCIES');

export { Tabs, TabsList, TabsTrigger, TabsContent }

// Mark as completely standalone implementation
(window as any).__STANDALONE_TABS__ = true;
console.log('🏁 tabs.tsx - Standalone tabs marked as loaded');
