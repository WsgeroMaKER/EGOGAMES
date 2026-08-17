import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameData, StudioStats } from '@/types';
import { fetchAllGames } from '@/services/robloxApi';
import { GAMES_CONFIG } from '@/config/studio';

interface UseRobloxDataResult {
  games: GameData[];
  stats: StudioStats;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => void;
}

const DEFAULT_STATS: StudioStats = {
  totalGames: 0,
  playersOnline: 0,
  totalVisits: 0,
};

/** Base interval between successful refreshes (60 seconds) */
const BASE_REFRESH_INTERVAL = 60_000;
/** Maximum interval after exponential backoff (5 minutes) */
const MAX_REFRESH_INTERVAL = 300_000;
/** Minimum time between manual refreshes to prevent spam */
const MIN_REFRESH_GAP = 5_000;
/** When the tab has been hidden for this long, refresh on return */
const STALE_THRESHOLD = 30_000;

function computeStats(games: GameData[]): StudioStats {
  const availableGames = games.filter((g) => g.isAvailable);
  const playersOnline = availableGames.reduce((sum, g) => sum + g.players, 0);
  const totalVisits = availableGames.reduce((sum, g) => sum + g.totalVisits, 0);

  return {
    totalGames: availableGames.length,
    playersOnline,
    totalVisits,
  };
}

/**
 * Fetches live Roblox data for all configured games.
 * Combines player counts and visit counts into studio-level statistics.
 *
 * Key guarantees:
 * - On fetch failure, previously valid data is RETAINED (never overwritten
 *   with zeros). Only the error banner shows.
 * - On success, error is cleared and data is updated.
 * - Refreshes every 60s on success; backs off exponentially on failure.
 * - When the browser tab becomes visible again after being hidden, data is
 *   refreshed immediately if it is stale.
 * - Manual refresh is rate-limited to prevent API spam.
 * - Exposes `lastUpdated` so the UI can show "Updated X seconds ago".
 */
export function useRobloxData(): UseRobloxDataResult {
  const [games, setGames] = useState<GameData[]>([]);
  const [stats, setStats] = useState<StudioStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consecutiveFailuresRef = useRef(0);
  const lastFetchTimeRef = useRef(0);
  const isFetchingRef = useRef(false);

  const scheduleNextRefresh = useCallback((loadFn: () => Promise<void>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const failures = consecutiveFailuresRef.current;
    const interval =
      failures === 0
        ? BASE_REFRESH_INTERVAL
        : Math.min(
            BASE_REFRESH_INTERVAL * Math.pow(2, failures),
            MAX_REFRESH_INTERVAL,
          );

    timeoutRef.current = setTimeout(() => {
      loadFn();
    }, interval);
  }, []);

  const loadData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    lastFetchTimeRef.current = Date.now();

    try {
      const gameData = await fetchAllGames(GAMES_CONFIG);

      setGames(gameData);
      setStats(computeStats(gameData));
      setError(null);
      consecutiveFailuresRef.current = 0;
      setLastUpdated(Date.now());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load studio data';
      console.error('[useRobloxData] Failed to fetch Roblox data:', err);
      setError(message);
      consecutiveFailuresRef.current += 1;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      scheduleNextRefresh(loadData);
    }
  }, [scheduleNextRefresh]);

  useEffect(() => {
    loadData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadData]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
      if (timeSinceLastFetch >= STALE_THRESHOLD && !isFetchingRef.current) {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loadData]);

  const refresh = useCallback(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    if (timeSinceLastFetch < MIN_REFRESH_GAP) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    loadData();
  }, [loadData]);

  return { games, stats, loading, error, lastUpdated, refresh };
}
