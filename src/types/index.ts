export type ViewId = 'home' | 'games' | 'about' | 'contact';

/** Ownership classification for a configured game */
export type GameOwnershipType = 'studio' | 'acquired';

export interface GameConfig {
  /** Roblox Universe ID — used for the games API and thumbnail API */
  universeId: number;
  /** Roblox Place ID — used to build the play URL */
  placeId: number;
  /** Optional override: short description shown on cards (falls back to API data) */
  description?: string;
  /** Optional override: genre/category label (falls back to API data) */
  genre?: string;
  /** Optional override: custom category for filtering (falls back to genre) */
  category?: string;
  /** Mark as a featured game on the home page */
  featured?: boolean;
  /** Optional custom thumbnail URL — overrides Roblox thumbnail */
  customThumbnailUrl?: string;
  /** Optional custom icon URL — overrides Roblox icon */
  customIconUrl?: string;
  /** Whether this game was developed by the studio or acquired as a partial investment. Defaults to 'studio'. */
  ownershipType?: GameOwnershipType;
  /** For acquired games: minimum ownership percentage */
  ownershipMin?: number;
  /** For acquired games: maximum ownership percentage */
  ownershipMax?: number;
}

export interface GameData {
  universeId: number;
  placeId: number;
  rootPlaceId: number;
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
    isRNVAccount?: boolean;
  };
  thumbnailUrl: string | null;
  iconUrl: string | null;
  genre: string;
  category: string;
  players: number;
  totalVisits: number;
  created: string | null;
  updated: string | null;
  maxPlayers: number;
  playUrl: string;
  featured: boolean;
  /** Whether the game was successfully retrieved from Roblox */
  isAvailable: boolean;
  /** Ownership classification — 'studio' (developed by EGO? Games) or 'acquired' (partial investment) */
  ownershipType: GameOwnershipType;
  /** For acquired games: minimum ownership percentage (null for studio games) */
  ownershipMin: number | null;
  /** For acquired games: maximum ownership percentage (null for studio games) */
  ownershipMax: number | null;
}

export interface StudioStats {
  totalGames: number;
  playersOnline: number;
  totalVisits: number;
}

export interface Category {
  key: string;
  label: string;
}

export type SortOption = 'popular' | 'visits' | 'name' | 'players';

export interface StudioInfo {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  founded: string;
  discordUrl: string;
  email: string;
  social: {
    robloxGroup?: string;
    twitter?: string;
    youtube?: string;
  };
}
