import React from 'react';

export default function CyberGrid() {
  const floatingBubbles = [
    { size: 120, x: '10%', y: '20%', duration: '14s', delay: '0s', color: 'rgba(56, 189, 248, 0.12)' },
    { size: 180, x: '80%', y: '15%', duration: '18s', delay: '2s', color: 'rgba(99, 102, 241, 0.12)' },
    { size: 90, x: '45%', y: '65%', duration: '12s', delay: '4s', color: 'rgba(168, 85, 247, 0.12)' },
    { size: 150, x: '25%', y: '80%', duration: '16s', delay: '1s', color: 'rgba(56, 189, 248, 0.10)' },
    { size: 70, x: '70%', y: '75%', duration: '10s', delay: '3s', color: 'rgba(236, 72, 153, 0.10)' },
    { size: 210, x: '88%', y: '50%', duration: '20s', delay: '5s', color: 'rgba(56, 189, 248, 0.08)' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background dark slate base */}
      <div className="absolute inset-0 bg-[#06080e]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial Glow Orbs */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />

      {/* Floating Interactive Ambient Bubbles */}
      {floatingBubbles.map((bubble, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-2xl animate-pulse-slow pointer-events-none"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.x,
            top: bubble.y,
            backgroundColor: bubble.color,
            animationDuration: bubble.duration,
            animationDelay: bubble.delay,
          }}
        />
      ))}

      {/* Subtle top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06080e] to-transparent opacity-80" />
    </div>
  );
}
