import React from 'react';

/**
 * React Bits ShinyText component
 * Creates an iridescent holographic shine animation across typography.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.9)'
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block font-bold tracking-tight bg-clip-text text-transparent ${
        disabled ? 'text-slate-300' : 'animate-shimmer'
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, rgba(203, 213, 225, 0.6) 0%, ${shimmerColor} 50%, rgba(203, 213, 225, 0.6) 100%)`,
        backgroundSize: '200% 100%',
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
