import { cn } from '#/lib/utils';
import type { ReactNode } from 'react';

type FixedBoxProps = {
  children: ReactNode;
  className?: string;
};
const FixedBox = ({ children, className }: FixedBoxProps) => {
  return <div className={cn('absolute z-10', className)}>{children}</div>;
};
export default FixedBox;
