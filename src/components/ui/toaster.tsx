
import React from "react"

// Completely custom toast implementation with no external dependencies
interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: ToastItem[] = [];
const listeners: Array<() => void> = [];

export function Toaster() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    const listener = () => setCurrentToasts([...toasts]);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const removeToast = (id: string) => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach(listener => listener());
    }
  };

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all ${
            toast.variant === 'destructive' 
              ? 'border-red-500 bg-red-50 text-red-900' 
              : 'border-gray-200 bg-white text-gray-900'
          }`}
        >
          <div className="grid gap-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute right-1 top-1 rounded-md p-1 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
