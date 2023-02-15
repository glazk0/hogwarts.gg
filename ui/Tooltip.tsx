import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

type TooltipProps = {
  label: ReactNode;
  children: ReactNode;
};
export default function Tooltip({ label, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider disableHoverableContent>
      <TooltipPrimitive.Root delayDuration={150}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="py-1 px-2 rounded bg-zinc-900 data-open:animate-fadeIn data-closed:animate-fadeOut"
            sideOffset={5}
            collisionPadding={8}
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-zinc-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
