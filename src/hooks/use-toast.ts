'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = {
  toasts: [],
};

const listeners: Array<(state: ToastState) => void> = [];

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = genId();
  
  const newToast: Toast = {
    ...toast,
    id,
  };

  toastState.toasts = [newToast, ...toastState.toasts];
  listeners.forEach((listener) => {
    listener(toastState);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);

  return {
    id,
    dismiss: () => removeToast(id),
    update: (props: Partial<Toast>) => updateToast(id, props),
  };
}

function removeToast(id: string) {
  toastState.toasts = toastState.toasts.filter((toast) => toast.id !== id);
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

function updateToast(id: string, props: Partial<Toast>) {
  toastState.toasts = toastState.toasts.map((toast) =>
    toast.id === id ? { ...toast, ...props } : toast
  );
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState);

  useState(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    return addToast(props);
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
} 