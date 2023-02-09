import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';

type DialogProps = {
  title: ReactNode;
  tooltip: ReactNode;
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function Dialog({
  title,
  tooltip,
  trigger,
  children,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <Tooltip label={tooltip}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      </Tooltip>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="p-4 bg-zinc-900 fixed inset-0 z-20 w-screen h-screen"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="flex justify-between">
            {title}
            <DialogPrimitive.Trigger>
              <IconX />
            </DialogPrimitive.Trigger>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
