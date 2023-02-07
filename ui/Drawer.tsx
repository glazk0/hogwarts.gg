import { cn } from '#/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';

type DrawerProps = {
  title: ReactNode;
  tooltip: ReactNode;
  trigger: ReactNode;
  children: ReactNode;
};

export default function Drawer({
  title,
  tooltip,
  trigger,
  children,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root modal={false}>
      <Tooltip label={tooltip}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      </Tooltip>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(
            'p-4 bg-zinc-900 w-96 fixed left-0 z-20 h-screen data-open:animate-fadeInFromLeft data-closed:animate-fadeOutToLeft',
          )}
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
