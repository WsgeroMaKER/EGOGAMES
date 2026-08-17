/**
 * Formats a number into a compact, human-readable string.
 * Examples: 1532 -> "1.5K", 1234567 -> "1.2M", 89 -> "89"
 */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toLocaleString();
  if (value < 1_000_000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
}

/**
 * Formats a full number with commas. Examples: 1234567 -> "1,234,567"
 */
export function formatFullNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Formats an ISO date string into a human-readable date.
 * Example: "2021-03-15T10:30:00Z" -> "March 15, 2021"
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Unknown';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns a relative time string. Example: "2 days ago", "3 months ago".
 */
export function formatRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Unknown';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Unknown';

  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Truncates text to a maximum length, adding an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generates a deterministic gradient pair from a string seed.
 * Used for placeholder visuals when no image is available.
 */
export function gradientFromString(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;
  return [`hsl(${hue1}, 70%, 45%)`, `hsl(${hue2}, 70%, 35%)`];
}
