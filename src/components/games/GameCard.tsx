import { useState } from 'react';
import { Play, Users, Eye, ImageOff, Maximize, Briefcase } from 'lucide-react';
import type { GameData } from '@/types';
import { formatCompactNumber, truncate } from '@/utils/format';

interface GameCardProps {
  game: GameData;
}

export function GameCard({ game }: GameCardProps) {
  const [thumbError, setThumbError] = useState(false);
  const [iconError, setIconError] = useState(false);

  const isAcquired = game.ownershipType === 'acquired';
  const ownershipLabel =
    isAcquired && game.ownershipMin !== null && game.ownershipMax !== null
      ? `${game.ownershipMin}%–${game.ownershipMax}% OWNERSHIP`
      : null;

  return (
    <div className="card-base overflow-hidden group hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-white/[0.02]">
        {game.thumbnailUrl && !thumbError ? (
          <img
            src={game.thumbnailUrl}
            alt={`${game.name} thumbnail`}
            loading="lazy"
            onError={() => setThumbError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <ImageOff size={32} className="text-white/20" />
          </div>
        )}

        {/* Icon badge */}
        <div className="absolute bottom-3 left-3 w-12 h-12 rounded-none overflow-hidden border border-white/20 shadow-lg bg-black">
          {game.iconUrl && !iconError ? (
            <img
              src={game.iconUrl}
              alt={`${game.name} icon`}
              loading="lazy"
              onError={() => setIconError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="font-display text-lg font-bold text-white">
                {game.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Genre badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-none glass-strong text-xs font-medium text-white">
          {game.category}
        </div>

        {/* Unavailable badge */}
        {!game.isAvailable && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-none bg-white/80 backdrop-blur-sm text-xs font-medium text-black">
            Unavailable
          </div>
        )}

        {/* Hover overlay with play button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none font-semibold text-black bg-white transition-all hover:scale-105">
            <Play size={18} className="fill-black" />
            Play on Roblox
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Ownership badges */}
        {isAcquired && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {ownershipLabel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none bg-white text-xs font-bold text-black tracking-wide">
                <Briefcase size={11} className="fill-black" />
                {ownershipLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none glass text-xs font-medium text-gray-400 border border-white/10">
              Acquired Project
            </span>
          </div>
        )}
        {!isAcquired && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-medium text-gray-500 border-l-2 border-white/30">
              Studio Game
            </span>
          </div>
        )}

        <h3 className="font-display text-lg font-bold text-white leading-tight mb-1.5 line-clamp-1">
          {game.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {game.description ? truncate(game.description, 120) : 'An exciting Roblox experience.'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-gray-400">
            <Users size={15} className="text-white/60" />
            {game.isAvailable ? formatCompactNumber(game.players) : '—'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-400">
            <Eye size={15} className="text-white/60" />
            {game.isAvailable ? formatCompactNumber(game.totalVisits) : '—'}
          </span>
          {game.isAvailable && game.maxPlayers > 0 && (
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <Maximize size={15} className="text-white/60" />
              {formatCompactNumber(game.maxPlayers)}
            </span>
          )}
        </div>

        {/* Play button */}
        <a
          href={game.playUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-none text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-all"
        >
          <Play size={16} className="fill-black" />
          Play on Roblox
        </a>
      </div>
    </div>
  );
}
