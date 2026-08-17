import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Gamepad2, Frown, Gamepad2 as StudioIcon, Briefcase } from 'lucide-react';
import { GameCard } from '@/components/games/GameCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CATEGORIES } from '@/config/studio';
import type { GameData, SortOption } from '@/types';

interface GamesProps {
  games: GameData[];
  loading: boolean;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'visits', label: 'Most Visited' },
  { value: 'players', label: 'Most Players' },
  { value: 'name', label: 'Name (A-Z)' },
];

export function Games({ games, loading }: GamesProps) {
  const containerRef = useScrollReveal<HTMLElement>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  const availableCategories = useMemo(() => {
    const cats = new Set(games.map((g) => g.category));
    return CATEGORIES.filter(
      (c) => c.key === 'all' || cats.has(c.key),
    );
  }, [games]);

  const applyFiltersAndSort = (list: GameData[]) => {
    let result = [...list];

    if (activeCategory !== 'all') {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query),
      );
    }

    switch (sortOption) {
      case 'visits':
        result.sort((a, b) => b.totalVisits - a.totalVisits);
        break;
      case 'players':
        result.sort((a, b) => b.players - a.players);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.totalVisits - a.totalVisits);
        break;
    }

    return result;
  };

  const studioGames = useMemo(
    () => applyFiltersAndSort(games.filter((g) => g.ownershipType === 'studio')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [games, activeCategory, searchQuery, sortOption],
  );

  const acquiredGames = useMemo(
    () => applyFiltersAndSort(games.filter((g) => g.ownershipType === 'acquired')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [games, activeCategory, searchQuery, sortOption],
  );

  const filteredGames = useMemo(
    () => [...studioGames, ...acquiredGames],
    [studioGames, acquiredGames],
  );

  const isLoading = loading && games.length === 0;

  return (
    <section ref={containerRef} className="relative section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-jp text-xs tracking-widest text-gray-600">
              ポートフォリオ
            </span>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="reveal section-title">
            Our Portfolio
          </h2>
          <p className="reveal section-subtitle">
            Explore experiences developed by EGO? Games and selected projects
            in which we hold partial ownership.
          </p>
        </div>

        {/* Search and controls */}
        <div className="reveal mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-none glass text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full md:w-auto pl-12 pr-8 py-3 rounded-none glass text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-all appearance-none cursor-pointer min-w-[180px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-black text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'text-black bg-white'
                    : 'text-gray-500 glass hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="reveal mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading
              ? 'Loading games...'
              : `${filteredGames.length} game${filteredGames.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-base overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/[0.04]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/[0.06] w-3/4" />
                  <div className="h-4 bg-white/[0.04] w-full" />
                  <div className="h-4 bg-white/[0.04] w-2/3" />
                  <div className="h-9 bg-white/[0.06] w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="reveal flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 glass mb-4">
              <Frown size={40} className="text-gray-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              No games found
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {searchQuery
                ? `No games match "${searchQuery}". Try a different search term.`
                : 'No games in this category yet. Check back soon!'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="btn-secondary"
            >
              <Gamepad2 size={18} />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {/* Studio Games */}
            {studioGames.length > 0 && (
              <div>
                <div className="reveal flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-none glass shrink-0">
                    <StudioIcon size={18} className="text-white/80" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-white">
                      Studio Games
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Developed by EGO? Games
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-gray-600 tabular-nums">
                    {studioGames.length} game{studioGames.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {studioGames.map((game) => (
                    <GameCard key={game.universeId} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Acquired Games */}
            {acquiredGames.length > 0 && (
              <div>
                <div className="reveal flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-none glass shrink-0">
                    <Briefcase size={18} className="text-white/80" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-white">
                      Acquired Games
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Selected projects with partial EGO? Games ownership
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-gray-600 tabular-nums">
                    {acquiredGames.length} game{acquiredGames.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {acquiredGames.map((game) => (
                    <GameCard key={game.universeId} game={game} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
