import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ROBLOX_GAMES_API = "https://games.roblox.com/v1/games";
const ROBLOX_THUMBNAILS_API =
  "https://thumbnails.roblox.com/v1/games/multiget/thumbnails";
const ROBLOX_ICONS_API = "https://thumbnails.roblox.com/v1/games/icons";

/**
 * The Roblox multi-get games API accepts a maximum of 100 universe IDs per
 * request. We batch to stay safely under the limit.
 */
const MAX_IDS_PER_BATCH = 50;

/**
 * The thumbnails API accepts a smaller batch size. Keep it conservative to
 * avoid rate limiting.
 */
const MAX_THUMBNAIL_IDS_PER_BATCH = 25;

/** Maximum retries on 429 (rate limited) responses per batch */
const MAX_RETRIES = 2;
/** Base delay (ms) before retrying after a 429 */
const RATE_LIMIT_DELAY = 1500;

interface GameDetail {
  id: number;
  rootPlaceId: number;
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
    isRNVAccount: boolean;
  };
  visits?: number;
  genre?: string;
  created?: string;
  updated?: string;
  playing?: number;
  maxPlayers?: number;
}

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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}

/**
 * Splits an array into chunks of the given size.
 */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Fetches a URL with retry-on-429 logic. Returns the Response or null
 * if all attempts fail (network error or persistent 429/5xx).
 */
async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES,
): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;

      if (res.status === 429 && attempt < retries) {
        // Exponential backoff: 1.5s, 3s, 6s...
        const delay = RATE_LIMIT_DELAY * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // Non-429 error or out of retries — return null to signal failure
      return null;
    } catch {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY * attempt));
        continue;
      }
      return null;
    }
  }
  return null;
}

/**
 * Fetches game details in batches, handling rate limits and partial failures.
 * Returns a map of universeId -> GameDetail for every successfully fetched game.
 */
async function fetchGameDetails(
  universeIds: number[],
): Promise<Map<number, GameDetail>> {
  const result = new Map<number, GameDetail>();
  const batches = chunk(universeIds, MAX_IDS_PER_BATCH);

  for (const batch of batches) {
    const idsQuery = batch.join(",");
    const res = await fetchWithRetry(
      `${ROBLOX_GAMES_API}?universeIds=${idsQuery}`,
    );

    if (!res) continue;

    try {
      const body = await res.json();
      for (const game of body.data ?? []) {
        if (game && typeof game.id === "number") {
          result.set(game.id, game as GameDetail);
        }
      }
    } catch {
      // JSON parse failure on this batch — continue to next
    }
  }

  return result;
}

/**
 * Fetches thumbnail URLs in batches, handling rate limits and partial failures.
 */
async function fetchThumbnails(
  universeIds: number[],
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  const batches = chunk(universeIds, MAX_THUMBNAIL_IDS_PER_BATCH);

  for (const batch of batches) {
    const idsQuery = batch.join(",");
    const res = await fetchWithRetry(
      `${ROBLOX_THUMBNAILS_API}?universeIds=${idsQuery}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`,
    );

    if (!res) continue;

    try {
      const body = await res.json();
      for (const item of body.data ?? []) {
        if (typeof item.universeId !== "number") continue;
        const firstThumb = item.thumbnails?.[0];
        if (firstThumb?.state === "Completed" && firstThumb.imageUrl) {
          result.set(item.universeId, firstThumb.imageUrl);
        }
      }
    } catch {
      // JSON parse failure — continue
    }
  }

  return result;
}

/**
 * Fetches icon URLs in batches, handling rate limits and partial failures.
 */
async function fetchIcons(
  universeIds: number[],
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  const batches = chunk(universeIds, MAX_THUMBNAIL_IDS_PER_BATCH);

  for (const batch of batches) {
    const idsQuery = batch.join(",");
    const res = await fetchWithRetry(
      `${ROBLOX_ICONS_API}?universeIds=${idsQuery}&size=512x512&format=Png&isCircular=false`,
    );

    if (!res) continue;

    try {
      const body = await res.json();
      for (const item of body.data ?? []) {
        if (item.state === "Completed" && item.imageUrl) {
          result.set(item.targetId, item.imageUrl);
        }
      }
    } catch {
      // JSON parse failure — continue
    }
  }

  return result;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Only accept GET
  if (req.method !== "GET") {
    return json({ error: "Method not allowed. Use GET." }, 405);
  }

  try {
    const url = new URL(req.url);
    const universeIdsParam = url.searchParams.get("universeIds");

    if (!universeIdsParam) {
      return json({ error: "Missing universeIds parameter" }, 400);
    }

    const universeIds = universeIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
      .map(Number)
      .filter((id) => !isNaN(id) && id > 0);

    if (universeIds.length === 0) {
      return json({ error: "No valid universe IDs provided" }, 400);
    }

    // Fetch all data in parallel — each function handles its own batching
    const [detailsMap, thumbnailsMap, iconsMap] = await Promise.all([
      fetchGameDetails(universeIds),
      fetchThumbnails(universeIds),
      fetchIcons(universeIds),
    ]);

    // Combine into response — each game is marked as available/unavailable.
    // A game is available only if Roblox returned details for it.
    const games: ProxyGame[] = universeIds.map((universeId) => {
      const detail = detailsMap.get(universeId);
      const isAvailable = detail !== undefined;

      return {
        universeId,
        rootPlaceId: detail?.rootPlaceId ?? 0,
        name: detail?.name ?? `Game ${universeId}`,
        description: detail?.description ?? "",
        creator: detail?.creator ?? {
          id: 0,
          name: "Unknown",
          type: "User",
          isRNVAccount: false,
        },
        thumbnailUrl: thumbnailsMap.get(universeId) ?? null,
        iconUrl: iconsMap.get(universeId) ?? null,
        genre: detail?.genre ?? "Game",
        players: detail?.playing ?? 0,
        totalVisits: detail?.visits ?? 0,
        created: detail?.created ?? null,
        updated: detail?.updated ?? null,
        maxPlayers: detail?.maxPlayers ?? 0,
        isAvailable,
      };
    });

    // Always return { games: [...] } even if all are unavailable.
    // The frontend uses isAvailable to distinguish real "game offline" from
    // a proxy failure (which throws and is handled by the caller).
    return json({ games });
  } catch (err) {
    // Catch-all: always return valid JSON, never a bare 500 text body
    return json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
