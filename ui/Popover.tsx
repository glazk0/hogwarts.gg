import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export default function Popover({ trigger, children }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="p-4 rounded bg-zinc-900 w-96"
          sideOffset={5}
          collisionPadding={8}
        >
          {children}
          <PopoverPrimitive.Arrow className="fill-zinc-900" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
