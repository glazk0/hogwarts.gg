import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';

type PopoverProps = {
  trigger: ReactNode;
  tooltip: ReactNode;
  children: ReactNode;
};

export default function Popover({ trigger, tooltip, children }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <Tooltip label={tooltip}>
        <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      </Tooltip>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="p-4 rounded bg-zinc-900 w-96 data-open:animate-fadeIn data-closed:animate-fadeOut"
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