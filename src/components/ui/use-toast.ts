
// Completely custom toast hook with no external dependencies

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

const toasts: Array<{ id: string } & ToastOptions> = [];
const listeners: Array<() => void> = [];

let toastIdCounter = 0;

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    const id = `toast-${++toastIdCounter}`;
    const toastItem = { id, ...options };
    
    toasts.push(toastItem);
    listeners.forEach(listener => listener());
    
    // Auto-remove after duration
    const duration = options.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        const index = toasts.findIndex(t => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
          listeners.forEach(listener => listener());
        }
      }, duration);
    }
    
    return { id };
  };

  return {
    toast,
    toasts
  };
};
