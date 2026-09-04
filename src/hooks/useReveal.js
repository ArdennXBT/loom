import { useEffect, useRef, useState } from 'react';

/**
 * useReveal
 * Détecte quand un élément entre dans le viewport et retourne
 * une ref à attacher + un booléen "visible" pour déclencher une
 * animation CSS (fade + translate) au scroll.
 *
 * L'animation se joue toujours au scroll (indépendamment des
 * réglages système), une seule fois par élément.
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