import { cn } from '#/lib/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

type PopoverProps = PopoverPrimitive.PopoverProps;

export default function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root {...props} />;
}

Popover.Content = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, ...props }, ref) {
  return (
    <PopoverPrimitive.Content
      className={cn('p-4 rounded bg-black w-96', className)}
      sideOffset={5}
      collisionPadding={8}
      {...props}
      ref={ref}
    />
  );
});

Popover.Root = PopoverPrimitive.Root;
Popover.Trigger = PopoverPrimitive.Trigger;
Popover.Portal = PopoverPrimitive.Portal;
Popover.Arrow = PopoverPrimitive.Arrow;
