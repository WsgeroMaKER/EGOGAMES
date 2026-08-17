import type { GameConfig, StudioInfo } from '@/types';

/**
 * Central studio configuration.
 * Change any value here and it propagates across the entire website.
 */
export const STUDIO_CONFIG: StudioInfo = {
  name: 'EGO? Games',
  tagline: 'Premium Roblox Experiences',
  description:
    'EGO? Games is a professional Roblox development studio crafting immersive, high-quality experiences that captivate millions of players worldwide. From action-packed adventures to creative simulations, we build games that players love.',
  mission:
    'Our mission is to push the boundaries of what is possible on Roblox — combining polished gameplay, striking visuals, and innovative mechanics to deliver experiences that keep players coming back.',
  founded: '2025',
  discordUrl: 'https://discord.gg/sCE4gpGshk',
  email: 'contact@egogames.com',
  social: {
    robloxGroup: 'https://www.roblox.com/communities/247123479/EGO#!/about',
    twitter: 'https://twitter.com/egogames',
    youtube: 'https://youtube.com/@egogames',
  },
};

/**
 * Registered games — add or remove Roblox Universe IDs and Place IDs here.
 * The website automatically fetches live data (thumbnails, icons, visits,
 * player counts, descriptions) from the Roblox API for every entry.
 *
 * To add a new game:
 *   1. Find the game's Universe ID and Place ID on the Roblox Creator Dashboard.
 *   2. Add an object to the array below.
 *   3. Optionally set `featured: true` to highlight it.
 *   4. Optionally set `category` to override the Roblox genre for filtering.
 *   5. Optionally set `customThumbnailUrl` / `customIconUrl` to override images.
 */
export const GAMES_CONFIG: GameConfig[] = [
  {
    universeId: 10091482757,
    placeId: 82329146189989,
    featured: true,
  },
  {
    universeId: 9989167758,
    placeId: 97604904645120,
    featured: true,
  },
  {
    universeId: 10364071467,
    placeId: 88082223797821,
    featured: false,
    ownershipType: 'acquired',
    ownershipMin: 20,
    ownershipMax: 40,
  },
  {
    universeId: 10357953539,
    placeId: 95226606252254,
    featured: false,
  },
];

/**
 * Category list for the filter UI.
 * The "All Games" entry is always shown first; the rest are sorted
 * alphabetically. Only categories that match at least one game's
 * category/genre are displayed.
 */
export const CATEGORIES = [
  { key: 'all', label: 'All Games' },
  { key: 'Adventure', label: 'Adventure' },
  { key: 'Action', label: 'Action' },
  { key: 'Roleplay', label: 'Roleplay' },
  { key: 'Simulation', label: 'Simulation' },
  { key: 'Strategy', label: 'Strategy' },
  { key: 'Sports', label: 'Sports' },
  { key: 'Fighting', label: 'Fighting' },
  { key: 'Horror', label: 'Horror' },
  { key: 'Building', label: 'Building' },
  { key: 'FPS', label: 'FPS' },
  { key: 'RPG', label: 'RPG' },
  { key: 'Puzzle', label: 'Puzzle' },
  { key: 'Obby', label: 'Obby' },
  { key: 'Tycoon', label: 'Tycoon' },
  { key: 'Social', label: 'Social' },
] as const;
