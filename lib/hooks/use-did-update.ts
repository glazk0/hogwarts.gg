import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

const useDidUpdate = (effect: EffectCallback, deps?: DependencyList) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      effect();
    } else {
      mounted.current = true;
    }
  }, deps);
};

export default useDidUpdate;
