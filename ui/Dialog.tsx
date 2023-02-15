import { cn } from '#/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';

type DialogProps = {
  title?: ReactNode;
  tooltip: ReactNode;
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  fullscreen?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export default function Dialog({
  title,
  tooltip,
  trigger,
  children,
  open,
  fullscreen,
  className,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <Tooltip label={tooltip}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      </Tooltip>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(
            'bg-zinc-900 fixed z-20',
            {
              'inset-0 w-screen h-screen': fullscreen,
              'left-1/2 -translate-x-2/4 top-16 h-fit max-h-[calc(100vh-8rem)]':
                !fullscreen,
            },
            className,
          )}
        >
          {title && (
            <div className="flex justify-between">
              {title}
              <DialogPrimitive.Trigger>
                <IconX />
              </DialogPrimitive.Trigger>
            </div>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
