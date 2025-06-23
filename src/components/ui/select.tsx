
import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

console.log('🛡️ select.tsx - STANDALONE select implementation with NO Radix dependencies');

// Context for managing select state
interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within a Select provider')
  }
  return context
}

// Root Select component
interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value = '', onValueChange, children }: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(value)
  const [open, setOpen] = React.useState(false)
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  console.log('✅ Select - STANDALONE implementation with no Radix');

  return (
    <SelectContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange,
      open,
      setOpen
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// SelectGroup component (passthrough)
const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

// SelectValue component
interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className }, ref) => {
    const { value } = useSelectContext()
    
    return (
      <span ref={ref} className={className}>
        {value || placeholder}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

// SelectTrigger component
interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children }, ref) => {
    const { open, setOpen } = useSelectContext()

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

// SelectScrollUpButton component
const SelectScrollUpButton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
    >
      <ChevronUp className="h-4 w-4" />
    </div>
  )
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

// SelectScrollDownButton component
const SelectScrollDownButton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
    >
      <ChevronDown className="h-4 w-4" />
    </div>
  )
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

// SelectContent component
interface SelectContentProps {
  className?: string
  children: React.ReactNode
  position?: "popper" | "item-aligned"
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper" }, ref) => {
    const { open, setOpen } = useSelectContext()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, setOpen])

    if (!open) return null

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md top-full mt-1 w-full",
          position === "popper" && "data-[side=bottom]:translate-y-1",
          className
        )}
      >
        <SelectScrollUpButton />
        <div className="p-1">
          {children}
        </div>
        <SelectScrollDownButton />
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

// SelectLabel component
interface SelectLabelProps {
  className?: string
  children: React.ReactNode
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    >
      {children}
    </div>
  )
)
SelectLabel.displayName = "SelectLabel"

// SelectItem component - now with disabled support
interface SelectItemProps {
  className?: string
  children: React.ReactNode
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled = false }, ref) => {
    const { value: selectedValue, onValueChange, setOpen } = useSelectContext()
    const isSelected = selectedValue === value

    const handleClick = () => {
      if (disabled) return
      onValueChange(value)
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
          disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        <span>{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

// SelectSeparator component
interface SelectSeparatorProps {
  className?: string
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
    />
  )
)
SelectSeparator.displayName = "SelectSeparator"

console.log('🎯 select.tsx - STANDALONE select system ready with disabled support - NO RADIX DEPENDENCIES');

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

// Mark as completely standalone implementation
(window as any).__STANDALONE_SELECT__ = true;
console.log('🏁 select.tsx - Standalone select with disabled support marked as loaded');
