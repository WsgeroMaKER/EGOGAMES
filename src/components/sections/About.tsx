import { Target, Zap, Users, Award, Rocket } from 'lucide-react';
import { STUDIO_CONFIG } from '@/config/studio';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { formatCompactNumber } from '@/utils/format';
import type { StudioStats } from '@/types';

interface AboutProps {
  stats: StudioStats;
  loading: boolean;
}

const VALUES = [
  {
    icon: Zap,
    title: 'Innovation',
    description:
      'We push the boundaries of the Roblox platform with creative mechanics and cutting-edge systems.',
  },
  {
    icon: Award,
    title: 'Quality',
    description:
      'Every game we ship is polished to a professional standard — from gameplay to visual design.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Our players are at the heart of everything we do. We listen, adapt, and build for them.',
  },
  {
    icon: Target,
    title: 'Precision',
    description:
      'We treat every detail with intention. Clean design, sharp execution, zero compromise.',
  },
];

export function About({ stats, loading }: AboutProps) {
  const containerRef = useScrollReveal<HTMLElement>();

  const highlights = [
    { value: `${new Date().getFullYear() - Number(STUDIO_CONFIG.founded)}+`, label: 'Years of Experience' },
    { value: loading ? '—' : `${stats.totalGames}`, label: 'Games Published' },
    { value: loading ? '—' : formatCompactNumber(stats.totalVisits), label: 'Total Visits' },
    { value: '24/7', label: 'Community Support' },
  ];

  return (
    <section ref={containerRef} className="relative section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-jp text-xs tracking-widest text-gray-600">
              关于
            </span>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="reveal section-title">
            About EGO? Games
          </h2>
          <p className="reveal section-subtitle">
            A studio dedicated to creating the next generation of Roblox experiences.
          </p>
        </div>

        {/* Story */}
        <div className="reveal card-base p-8 md:p-12 mb-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none glass text-xs font-medium text-gray-400 border-l-2 border-white">
                <Rocket size={12} className="text-white" />
                Founded in {STUDIO_CONFIG.founded}
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Our Story
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {STUDIO_CONFIG.description}
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none glass text-xs font-medium text-gray-400 border-l-2 border-white">
                <Target size={12} className="text-white" />
                Our Mission
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                What We Do
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {STUDIO_CONFIG.mission}
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="card-base p-5 text-center hover:bg-white/[0.04] transition-all"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                {item.value}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-4">
          <h3 className="reveal font-display text-2xl font-bold text-white text-center mb-8">
            What We Stand For
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="reveal card-base p-6 hover:bg-white/[0.04] hover:-translate-y-1 transition-all group"
            >
              <div className="p-3 rounded-none glass mb-4 transition-transform group-hover:scale-110">
                <value.icon size={24} className="text-white/80" />
              </div>
              <h4 className="font-display text-lg font-semibold text-white mb-2">
                {value.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
