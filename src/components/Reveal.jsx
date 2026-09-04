import useReveal from '../hooks/useReveal';
import './Reveal.css';

/**
 * Reveal
 * Wraps a section and animates it (fade + slide + scale)
 * when it enters the viewport on scroll.
 *
 * Props:
 * - direction: 'up' | 'left' | 'right' | 'scale'
 * - delay: delay in ms before the animation starts
 */
function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [ref, isVisible] = useReveal({
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

export default Reveal;