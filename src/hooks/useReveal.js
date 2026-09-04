import { useEffect, useRef, useState } from 'react';

/**
 * useReveal
 * Detects when an element enters the viewport and returns
 * a ref to attach + a "visible" boolean to trigger a
 * CSS animation (fade + translate) on scroll.
 *
 * The animation always plays on scroll (regardless of
 * system settings), once per element.
 */
function useReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, threshold, rootMargin]);

  return [ref, isVisible];
}

export default useReveal;