interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black">
        <img
          src="/image.png"
          alt="EGO? Games logo"
          className="h-full w-full object-cover"
        />
      </div>
      {showText && (
        <span className="font-display text-lg font-bold text-white tracking-tight">
          EGO<span className="text-gray-500">?</span> Games
        </span>
      )}
    </div>
  );
}
