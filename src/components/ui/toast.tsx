'use client';

import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 w-full max-w-sm p-4 space-y-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${
            toast.variant === 'destructive'
              ? 'border-l-4 border-red-500'
              : 'border-l-4 border-green-500'
          }`}
        >
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {toast.title}
            </div>
            {toast.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {toast.description}
              </div>
            )}
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => dismiss(toast.id)}
          >
            <span className="sr-only">Close</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
} 