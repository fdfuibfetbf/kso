import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, ...props }, ref) => {
    // Filter out attributes injected by browser extensions that cause React warnings
    const {
      fdprocessedid,
      'data-lastpass-icon-root': dataLastpassIconRoot,
      'data-1p-ignore': data1pIgnore,
      'data-lpignore': dataLpignore,
      ...validProps
    } = props as any;

    return (
      <input
        type={type}
        className={`flex h-10 w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 ${className}`}
        ref={ref}
        suppressHydrationWarning
        {...validProps}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

