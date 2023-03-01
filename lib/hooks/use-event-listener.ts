import type { DependencyList } from 'react';
import { useEffect } from 'react';

export default function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  deps: DependencyList,
) {
  useEffect(() => {
    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    };
  }, deps);
}

export function dispatchEvent(
  name: string,
  options?: CustomEventInit<unknown>,
) {
  const event = new CustomEvent(name, options);
  window.dispatchEvent(event);
}
