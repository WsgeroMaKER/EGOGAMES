import { useEffect, useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { STUDIO_CONFIG } from '@/config/studio';
import type { ViewId } from '@/types';

interface NavbarProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
}

interface NavItem {
  label: string;
  view: ViewId;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', view: 'home' },
  { label: 'Games', view: 'games' },
  { label: 'About', view: 'about' },
  { label: 'Contact', view: 'contact' },
];

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (view: ViewId) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const isActive = (view: ViewId) => {
    return currentView === view;
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/40'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom flex items-center justify-between h-16 md:h-18">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label="EGO? Games home"
          >
            <Logo />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-all duration-200 relative ${
                  isActive(item.view)
                    ? 'text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {item.label}
                {isActive(item.view) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white" />
                )}
              </button>
            ))}
            <a
              href={STUDIO_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-none text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-all duration-300"
            >
              <MessageCircle size={16} />
              Discord
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-none text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-16 inset-x-0 glass-strong rounded-b-none mx-3 overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-4 py-3 rounded-none text-left text-base font-medium transition-all ${
                  isActive(item.view)
                    ? 'text-white border-l-2 border-white pl-3'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href={STUDIO_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-none text-base font-semibold text-black bg-white transition-all"
            >
              <MessageCircle size={18} />
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
