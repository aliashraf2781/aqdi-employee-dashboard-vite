import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const panelVariants = cva(
  'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-card bg-surface p-6 shadow-card focus:outline-none',
  {
    variants: { size: { sm: 'max-w-dialog-sm', md: 'max-w-dialog-md', lg: 'max-w-dialog-lg' } },
    defaultVariants: { size: 'md' },
  },
);

/**
 * The single modal used across the app. Confirm and form dialogs are built on top of it,
 * so overlay, close button, focus trap and animation live in exactly one place.
 */
export function Modal({ open, onOpenChange, title, description, size, footer, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(panelVariants({ size }))}>
          <Dialog.Close
            aria-label="إغلاق"
            className="absolute end-4 top-4 rounded-sm text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </Dialog.Close>

          <Dialog.Title className="text-lg font-bold text-foreground">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}

          <div className="mt-4">{children}</div>
          {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
