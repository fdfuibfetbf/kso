import * as React from 'react';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => handleOpenChange(false)}
        />
        <div className="relative z-50 w-full h-full sm:w-auto sm:h-auto">{children}</div>
      </div>
    </DialogContext.Provider>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  return (
    <div
      ref={ref}
      className={`w-full h-full sm:w-auto sm:h-auto sm:max-w-lg sm:max-h-[90vh] overflow-y-auto fixed sm:relative sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] left-0 top-0 translate-x-0 translate-y-0 z-50 grid gap-4 border-0 sm:border border-gray-200 bg-white p-4 sm:p-6 shadow-lg sm:rounded-lg transition-all duration-200 ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
      <button
        className="absolute right-3 sm:right-4 top-3 sm:top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-2xl sm:text-xl w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center"
        onClick={() => context.onOpenChange(false)}
      >
        ×
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = '', ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

