import { MessageCircle, Globe, Mail, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { STUDIO_CONFIG } from '@/config/studio';
import type { ViewId } from '@/types';

interface FooterProps {
  onNavigate: (view: ViewId) => void;
}

const FOOTER_LINKS: Array<{ label: string; view: ViewId }> = [
  { label: 'Home', view: 'home' },
  { label: 'Games', view: 'games' },
  { label: 'About', view: 'about' },
  { label: 'Contact', view: 'contact' },
];

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {STUDIO_CONFIG.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={STUDIO_CONFIG.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-none glass hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all"
                aria-label="Discord"
              >
                <MessageCircle size={18} />
              </a>
              {STUDIO_CONFIG.social.twitter && (
                <a
                  href={STUDIO_CONFIG.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-none glass hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all"
                  aria-label="Twitter"
                >
                  <Globe size={18} />
                </a>
              )}
              {STUDIO_CONFIG.social.youtube && (
                <a
                  href={STUDIO_CONFIG.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-none glass hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              <a
                href={`mailto:${STUDIO_CONFIG.email}`}
                className="p-2 rounded-none glass hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Discord CTA */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
              Join the Community
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connect with fellow players, get the latest updates, and be part of
              the EGO? Games community.
            </p>
            <a
              href={STUDIO_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-all"
            >
              <MessageCircle size={16} />
              Join Discord
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {year} {STUDIO_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-jp text-xs text-gray-700 tracking-widest">
              ゲームスタジオ
            </span>
            <span className="h-3 w-px bg-white/20" />
            <p className="text-sm text-gray-600">
              Built with precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
