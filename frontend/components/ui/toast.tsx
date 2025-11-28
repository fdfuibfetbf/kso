import * as React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md border shadow-lg ${bgColor}`}>
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

