import { Gamepad2, Users, Eye, Activity, Loader2, WifiOff } from 'lucide-react';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatFullNumber } from '@/utils/format';
import type { StudioStats } from '@/types';

interface StatsProps {
  stats: StudioStats;
  loading: boolean;
  error: string | null;
}

type DataStatus = 'loading' | 'live' | 'offline';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  status: DataStatus;
  delay: number;
}

function StatCard({ icon, label, value, status, delay }: StatCardProps) {
  const animatedValue = useAnimatedNumber(value, { duration: 2000, startDelay: delay });

  return (
    <div
      className="reveal card-base p-5 sm:p-6 md:p-8 hover:bg-white/[0.04] hover:-translate-y-1 group flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Top row: icon + status indicator */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="p-2.5 md:p-3 rounded-none glass text-white/80 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          {status === 'loading' && (
            <>
              <Loader2 size={12} className="animate-spin text-white/50" />
              <span className="text-gray-500">Loading</span>
            </>
          )}
          {status === 'live' && (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-green-400" />
              </span>
              <span className="text-green-400/80">Live</span>
            </>
          )}
          {status === 'offline' && (
            <>
              <WifiOff size={12} className="text-red-400/70" />
              <span className="text-red-400/70">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tabular-nums leading-none">
          {status === 'loading' ? (
            <span className="inline-block w-24 h-8 md:h-10 bg-white/[0.06] animate-pulse" />
          ) : status === 'offline' ? (
            <span className="text-gray-600 text-2xl md:text-3xl">Unable to load</span>
          ) : (
            formatFullNumber(animatedValue)
          )}
        </p>
        <p className="text-sm md:text-base text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export function Stats({ stats, loading, error }: StatsProps) {
  const status: DataStatus = loading ? 'loading' : error ? 'offline' : 'live';

  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-jp text-xs tracking-widest text-gray-600">
              統計
            </span>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="reveal section-title">
            Live Studio Statistics
          </h2>
          <p className="reveal section-subtitle">
            Real-time data powered by the Roblox platform, updated automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={<Gamepad2 size={24} className="text-white/80" />}
            label="Total Games"
            value={stats.totalGames}
            status={status}
            delay={0}
          />
          <StatCard
            icon={<Users size={24} className="text-white/80" />}
            label="Players Online"
            value={stats.playersOnline}
            status={status}
            delay={150}
          />
          <StatCard
            icon={<Eye size={24} className="text-white/80" />}
            label="Total Visits"
            value={stats.totalVisits}
            status={status}
            delay={300}
          />
        </div>

        {/* Last updated + next refresh indicator */}
        {status === 'live' && (
          <div className="reveal mt-6 flex items-center gap-2 text-xs text-gray-600">
            <Activity size={12} className="text-green-400/60" />
            <span>Auto-refreshing every 60 seconds</span>
          </div>
        )}
      </div>
    </section>
  );
}
