import { useEffect, useState } from 'react';

/**
 * A performance-conscious animated background using pure CSS animations.
 * Premium black-and-white aesthetic with Japanese-inspired patterns.
 */
export function AnimatedBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 bg-black bg-seigaiha bg-seigaiha opacity-40" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden="true">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      {/* Seigaiha (wave) pattern overlay */}
      <div className="absolute inset-0 bg-seigaiha bg-seigaiha opacity-60" />

      {/* Top radial glow — subtle white */}
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] rounded-full opacity-15 blur-[140px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Floating orbs — monochrome */}
      <div
        className="absolute top-[8%] left-[3%] w-[400px] h-[400px] rounded-full opacity-[0.07] blur-[100px] animate-float"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[100px] animate-float"
        style={{
          background: 'radial-gradient(circle, #888888 0%, transparent 70%)',
          animationDelay: '2s',
          animationDuration: '8s',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, #000000)',
        }}
      />

      {/* Vertical kanji decoration */}
      <div className="absolute right-4 top-1/4 hidden lg:block">
        <span className="kanji-deco text-[200px] leading-none writing-mode-vertical">
          道
        </span>
      </div>
    </div>
  );
}
