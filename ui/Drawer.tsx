import { cn } from '#/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons';
import type { ReactNode } from 'react';
import { useState } from 'react';

type DrawerProps = {
  title: ReactNode;
  trigger: ReactNode;
  children: ReactNode;
};

export default function Drawer({ title, trigger, children }: DrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root modal={false} open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(
            'p-4 bg-zinc-900 w-96 fixed left-0 z-20 h-screen data-open:animate-fadeInFromLeft data-closed:animate-fadeOutToLeft',
          )}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="flex justify-between">
            {title}
            <button onClick={() => setOpen(false)}>
              <IconX />
            </button>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
