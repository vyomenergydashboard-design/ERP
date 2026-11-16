import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Returns a function whose identity never changes but which always calls the
 * latest version of `fn`. Use it for handlers passed to memoised children so the
 * child neither re-renders on every parent render nor keeps a stale closure.
 *
 * The ref is updated in a layout effect, so the stable function must not be
 * called during render (event handlers and effects are fine).
 */
export function useStableCallback(fn) {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  return useCallback((...args) => fnRef.current(...args), []);
}

export default useStableCallback;
