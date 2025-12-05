"use client";

import { motion } from "framer-motion";
import { getOceanMood } from "@/lib/oceanData";

interface OceanAvatarProps {
  healthScore: number;
}

export function OceanAvatar({ healthScore }: OceanAvatarProps) {
  const { mood, emoji, message, color } = getOceanMood(healthScore);

  // Animation variants based on mood
  const waveVariants = {
    ecstatic: {
      y: [0, -15, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
    },
    happy: {
      y: [0, -10, 0],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" as const },
    },
    neutral: {
      y: [0, -5, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    worried: {
      y: [0, -3, 0],
      x: [-2, 2, -2],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
    angry: {
      y: [0, -8, 0],
      x: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    critical: {
      y: [0, -5, 0],
      x: [-8, 8, -8],
      rotate: [-5, 5, -5],
      transition: { duration: 0.3, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  const bubbleCount = mood === "ecstatic" ? 8 : mood === "happy" ? 5 : mood === "neutral" ? 3 : 1;

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-cyan-900/30 to-blue-900/50 border border-cyan-500/20">
      {/* Health Score Circle */}
      <div className="relative mb-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 352" }}
            animate={{ strokeDasharray: `${(healthScore / 100) * 352} 352` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl"
            animate={waveVariants[mood]}
          >
            {emoji}
          </motion.span>
        </div>
      </div>

      {/* Health Score Number */}
      <motion.div
        className="text-3xl font-bold mb-2"
        style={{ color }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {healthScore}
        <span className="text-lg text-gray-400">/100</span>
      </motion.div>

      {/* Mood Label */}
      <div className="text-sm uppercase tracking-wider text-gray-400 mb-3">
        Santé Océanique
      </div>

      {/* Ocean Message Bubble */}
      <motion.div
        className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xs text-center border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/10 rotate-45 border-l border-t border-white/20" />
        <p className="text-sm text-gray-200 italic">&quot;{message}&quot;</p>
        <p className="text-xs text-gray-400 mt-2">— L&apos;Océan</p>
      </motion.div>

      {/* Animated Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(bubbleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: 0,
            }}
            animate={{
              y: [0, -200],
              opacity: [0.6, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
