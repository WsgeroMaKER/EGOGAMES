import { useEffect, useRef, useState } from 'react';

interface UseAnimatedNumberOptions {
  duration?: number;
  startDelay?: number;
}

/**
 * Animates a number from its previous value to the new target using
 * requestAnimationFrame. Uses an ease-out cubic curve for smooth deceleration.
 * When the target changes (e.g. live stats refresh), animates from the
 * current displayed value to the new target instead of restarting from 0.
 *
 * On first mount, if the target is already non-zero, the animation starts
 * from 0 (the initial "count up" effect). If the target is 0 on mount
 * (e.g. loading state), the number stays at 0 and will animate up when
 * real data arrives.
 */
export function useAnimatedNumber(
  target: number,
  options: UseAnimatedNumberOptions = {},
): number {
  const { duration = 1500, startDelay = 0 } = options;
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const fromValueRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    // Cancel any in-flight animation
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startTimeRef.current = null;

    // If target is the same as what we're currently showing, do nothing
    if (target === currentRef.current) return;

    fromValueRef.current = currentRef.current;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const from = fromValueRef.current;
      const value = Math.floor(from + (target - from) * eased);

      currentRef.current = value;
      setCurrent(value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        currentRef.current = target;
        setCurrent(target);
      }
    };

    if (startDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        frameRef.current = requestAnimationFrame(animate);
      }, startDelay);
    } else {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [target, duration, startDelay]);

  return current;
}
