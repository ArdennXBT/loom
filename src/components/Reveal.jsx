import useReveal from '../hooks/useReveal';
import './Reveal.css';

/**
 * Reveal
 * Enveloppe une section et l'anime proprement (fade + léger slide)
 * quand elle entre dans le viewport au scroll.
 *
 * Props:
 * - direction: 'up' (defaut) | 'left' | 'right' — sens du mouvement
 * - delay: délai en ms avant le déclenchement (pour un effet en cascade)
 */
function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [ref, isVisible] = useReveal();

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