import { Gamepad2, MessageCircle, Sparkles } from 'lucide-react';
import { STUDIO_CONFIG } from '@/config/studio';
import type { ViewId } from '@/types';

interface HeroProps {
  onNavigate: (view: ViewId) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 md:pt-18 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none glass text-sm text-gray-400 mb-8 animate-fade-in-down border-l-2 border-white"
          >
            <Sparkles size={14} className="text-white" />
            <span>Professional Roblox Development Studio</span>
          </div>

          {/* Japanese accent line */}
          <div
            className="flex items-center gap-3 mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.05s', opacity: 0 }}
          >
            <span className="font-jp text-sm tracking-widest text-gray-600">
              ゲームスタジオ
            </span>
            <span className="h-px w-16 bg-white/20" />
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter text-gradient-hero text-shadow-glow animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            {STUDIO_CONFIG.name}
          </h1>

          {/* Tagline */}
          <p
            className="mt-4 font-display text-xl sm:text-2xl md:text-3xl text-white font-medium animate-fade-in-up"
            style={{ animationDelay: '0.15s', opacity: 0 }}
          >
            {STUDIO_CONFIG.tagline}
          </p>

          {/* Description */}
          <p
            className="mt-6 text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            {STUDIO_CONFIG.description}
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <button
              onClick={() => onNavigate('games')}
              className="btn-primary text-base px-8 py-4"
            >
              <Gamepad2 size={20} />
              Explore Games
            </button>
            <a
              href={STUDIO_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4"
            >
              <MessageCircle size={20} />
              Join Discord
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-fade-in"
            style={{ animationDelay: '1s', opacity: 0 }}
          >
            <span className="text-xs text-gray-600 uppercase tracking-widest font-jp">
              下
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-scroll-line origin-top" />
          </div>
        </div>
      </div>
    </section>
  );
}
