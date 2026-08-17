import { useCallback, useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Games } from '@/components/sections/Games';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { useRobloxData } from '@/hooks/useRobloxData';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ViewId } from '@/types';

function App() {
  const { games, stats, loading, error } = useRobloxData();
  const homeRevealRef = useScrollReveal<HTMLDivElement>();

  const handleNavigate = useCallback((view: ViewId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Use hash for basic deep-linking
    const hash = view === 'home' ? '#/' : `#/${view}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []);

  // Read initial view from hash
  const getInitialView = (): ViewId => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash === 'games') return 'games';
    if (hash === 'about') return 'about';
    if (hash === 'contact') return 'contact';
    return 'home';
  };

  const [currentView, setCurrentView] = useState<ViewId>(getInitialView);

  // Listen for browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash === 'games') setCurrentView('games');
      else if (hash === 'about') setCurrentView('about');
      else if (hash === 'contact') setCurrentView('contact');
      else setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.title =
      currentView === 'home'
        ? 'EGO? Games — Premium Roblox Experiences'
        : currentView === 'games'
          ? 'Games — EGO? Games'
          : currentView === 'about'
            ? 'About — EGO? Games'
            : currentView === 'contact'
              ? 'Contact — EGO? Games'
              : 'EGO? Games';
  }, [currentView]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {error && (
          <div className="container-custom mt-20">
            <div className="glass rounded-none p-4 border border-white/20 text-sm text-gray-400">
              Unable to load live Roblox data right now. Statistics shown may be
              from the last successful update. The site will retry automatically.
            </div>
          </div>
        )}

        {/* Home: kept mounted (hidden when inactive) to preserve Roblox data
            state and animated number state across navigation. */}
        <div
          ref={homeRevealRef}
          className={currentView === 'home' ? '' : 'hidden'}
          aria-hidden={currentView !== 'home'}
        >
          <Hero onNavigate={handleNavigate} />
          <Stats stats={stats} loading={loading} error={error} />
          <Games games={games} loading={loading} />
          <About stats={stats} loading={loading} />
          <Contact />
        </div>

        {currentView === 'games' && (
          <div className="pt-16 md:pt-18">
            <Games games={games} loading={loading} />
          </div>
        )}

        {currentView === 'about' && (
          <div className="pt-16 md:pt-18">
            <About stats={stats} loading={loading} />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-16 md:pt-18">
            <Contact />
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
