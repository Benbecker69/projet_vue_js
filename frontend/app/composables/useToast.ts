type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let _nextId = 0;

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => []);

  function show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = _nextId++;
    toasts.value.push({ id, message, type });
    if (import.meta.client) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, duration);
    }
  }

  return {
    toasts: readonly(toasts),
    show,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    info: (msg: string) => show(msg, 'info'),
  };
}
