import * as Dialog from '@radix-ui/react-dialog';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useFullscreen } from '@/shared/hooks/use-fullscreen';

const HEADER_BUTTON_CLASS =
  'flex size-9 items-center justify-center rounded-lg bg-sidebar-hover text-sidebar-foreground transition-colors hover:bg-sidebar-dark';

/**
 * A wide dialog with its own colored header and a button that takes it fullscreen.
 * `headerActions` are extra buttons shown before the fullscreen and close buttons.
 */
export function ExpandableDialog({ open, onOpenChange, title, description, icon, headerActions, children }) {
  const { ref, isFullscreen, toggle, exit } = useFullscreen();

  const handleOpenChange = (next) => {
    if (!next) exit();
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay/50" />
        <Dialog.Content
          ref={ref}
          dir="rtl"
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden bg-background shadow-card focus:outline-none',
            isFullscreen
              ? 'inset-0 h-screen w-screen'
              : 'left-1/2 top-1/2 max-h-dialog w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-card',
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 bg-sidebar px-5 py-3.5 text-sidebar-foreground">
            <div className="flex min-w-0 items-center gap-2.5">
              {icon && <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-hover">{icon}</span>}
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-black leading-tight">{title}</Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs font-medium opacity-80">{description}</Dialog.Description>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {headerActions}
              <button type="button" onClick={toggle} aria-label={isFullscreen ? 'تصغير' : 'توسيع'} className={HEADER_BUTTON_CLASS}>
                {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
              <Dialog.Close aria-label="إغلاق" className={HEADER_BUTTON_CLASS}>
                <X className="size-4" />
              </Dialog.Close>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
