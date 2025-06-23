
// This file should re-export the actual toast functionality
// Remove the circular import and use the correct hook location
export { useToast } from "@/hooks/use-toast";

// If there's a toast function, it should come from the hook as well
// For now, we'll create a simple wrapper if needed
import { useToast as useToastHook } from "@/hooks/use-toast";

export const toast = (() => {
  let toastRef: ReturnType<typeof useToastHook> | null = null;
  
  return (props: Parameters<ReturnType<typeof useToastHook>['toast']>[0]) => {
    if (typeof window !== 'undefined' && toastRef) {
      return toastRef.toast(props);
    }
    console.warn('Toast called before initialization');
  };
})();
