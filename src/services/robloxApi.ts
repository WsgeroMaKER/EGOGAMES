import type { GameConfig, GameData } from '@/types';

interface ProxyGame {
  universeId: number;
  rootPlaceId: number;
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
    isRNVAccount: boolean;
  };
  thumbnailUrl: string | null;
  iconUrl: string | null;
  genre: string;
  players: number;
  totalVisits: number;
  created: string | null;
  updated: string | null;
  maxPlayers: number;
  isAvailable: boolean;
}

interface ProxyResponse {
  games?: ProxyGame[];
  error?: string;
}

function playUrlFromPlaceId(placeId: number): string {
  return `https://www.roblox.com/games/${placeId}`;
}

function getProxyUrl(): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/roblox-proxy`;
}

function getAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY;
}

function mergeGame(config: GameConfig, data: ProxyGame | undefined): GameData {
  const isAvailable = data?.isAvailable ?? false;

  return {
    universeId: config.universeId,
    placeId: config.placeId,
    rootPlaceId: data?.rootPlaceId ?? config.placeId,
    name: data?.name ?? `Game ${config.universeId}`,
    description: config.description ?? data?.description ?? '',
    creator: data?.creator ?? { id: 0, name: 'EGO? Games', type: 'Group', isRNVAccount: false },
    thumbnailUrl: config.customThumbnailUrl ?? data?.thumbnailUrl ?? null,
    iconUrl: config.customIconUrl ?? data?.iconUrl ?? null,
    genre: config.genre ?? data?.genre ?? 'Game',
    category: config.category ?? config.genre ?? data?.genre ?? 'Game',
    players: data?.players ?? 0,
    totalVisits: data?.totalVisits ?? 0,
    created: data?.created ?? null,
    updated: data?.updated ?? null,
    maxPlayers: data?.maxPlayers ?? 0,
    playUrl: playUrlFromPlaceId(config.placeId),
    featured: config.featured ?? false,
    isAvailable,
    ownershipType: config.ownershipType ?? 'studio',
    ownershipMin: config.ownershipType === 'acquired' ? (config.ownershipMin ?? null) : null,
    ownershipMax: config.ownershipType === 'acquired' ? (config.ownershipMax ?? null) : null,
  };
}

/**
 * Custom error thrown when the proxy is unreachable or returns a non-OK
 * HTTP status. The caller should NOT overwrite previously valid data
 * with zeros when this fires — it should keep the old data and show
 * an error banner instead.
 */
export class RobloxFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RobloxFetchError';
  }
}

/**
 * Fetches combined data for all configured games through the Supabase edge
 * function proxy. The proxy calls the Roblox API server-side, avoiding CORS
 * restrictions and keeping any future API keys server-side only.
 *
 * THROWS on complete failure (network error, non-OK HTTP, invalid JSON,
 * or proxy-reported error) so the caller can retain previously fetched
 * data instead of overwriting it with zeros.
 *
 * On partial failure (proxy OK but some individual games missing from the
 * Roblox response), returns the available games alongside unavailable
 * placeholders — this is real data, not an error.
 */
export async function fetchAllGames(
  configs: GameConfig[],
): Promise<GameData[]> {
  if (configs.length === 0) return [];

  const universeIds = configs.map((c) => c.universeId).join(',');
  const proxyUrl = getProxyUrl();
  const anonKey = getAnonKey();

  let proxyData: ProxyResponse;

  try {
    const res = await fetch(`${proxyUrl}?universeIds=${universeIds}`, {
      headers: {
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new RobloxFetchError(
        `Roblox proxy request failed (${res.status})`,
      );
    }

    proxyData = await res.json() as ProxyResponse;
  } catch (err) {
    if (err instanceof RobloxFetchError) throw err;
    throw new RobloxFetchError(
      err instanceof Error ? err.message : 'Network request failed',
    );
  }

  if (proxyData.error) {
    throw new RobloxFetchError(proxyData.error);
  }

  if (!proxyData.games || !Array.isArray(proxyData.games)) {
    throw new RobloxFetchError('Proxy returned invalid response structure');
  }

  const gamesByUniverse = new Map(proxyData.games.map((g) => [g.universeId, g]));

  return configs.map((config) =>
    mergeGame(config, gamesByUniverse.get(config.universeId)),
  );
}

/**
 * Fetches a single game's full data by universe ID.
 */
export async function fetchGameByUniverseId(
  config: GameConfig,
): Promise<GameData> {
  const games = await fetchAllGames([config]);
  return games[0] ?? mergeGame(config, undefined);
}
