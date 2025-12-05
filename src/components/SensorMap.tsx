"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SensorLocation, calculateHealthScore } from "@/lib/oceanData";

interface SensorMapProps {
  locations: SensorLocation[];
  selectedLocation?: string;
  onSelectLocation?: (id: string) => void;
}

export function SensorMap({ locations, selectedLocation, onSelectLocation }: SensorMapProps) {
  // Simple map representation using positioned dots
  const getPositionOnMap = (lat: number, lng: number) => {
    // Convert lat/lng to percentage positions on a simple world map
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div className="relative w-full h-64 rounded-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-cyan-500/20 overflow-hidden">
      {/* Simple ocean background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 Q25 0 50 10 T100 10"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-cyan-400"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Sensor locations */}
      {locations.map((location) => {
        const pos = getPositionOnMap(location.lat, location.lng);
        const healthScore = calculateHealthScore(location.metrics);
        const isSelected = selectedLocation === location.id;

        const TrendIcon = location.trend === "improving" ? TrendingUp : location.trend === "declining" ? TrendingDown : Minus;
        const trendColor = location.trend === "improving" ? "text-green-400" : location.trend === "declining" ? "text-red-400" : "text-gray-400";

        return (
          <motion.button
            key={location.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 group",
              onSelectLocation && "cursor-pointer"
            )}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectLocation?.(location.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse ring for low health */}
            {healthScore < 50 && (
              <motion.div
                className="absolute inset-0 w-8 h-8 -m-2 rounded-full bg-red-500/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Main dot */}
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all",
                healthScore >= 70 && "bg-emerald-400 border-emerald-300",
                healthScore >= 50 && healthScore < 70 && "bg-amber-400 border-amber-300",
                healthScore < 50 && "bg-red-400 border-red-300",
                isSelected && "ring-2 ring-white ring-offset-2 ring-offset-slate-900"
              )}
            />

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-slate-800 rounded-lg p-3 shadow-xl border border-slate-700 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white truncate">{location.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Santé:</span>
                  <span className={cn(
                    "font-semibold",
                    healthScore >= 70 && "text-emerald-400",
                    healthScore >= 50 && healthScore < 70 && "text-amber-400",
                    healthScore < 50 && "text-red-400"
                  )}>
                    {healthScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">Tendance:</span>
                  <TrendIcon className={cn("w-4 h-4", trendColor)} />
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="w-2 h-2 bg-slate-800 border-r border-b border-slate-700 transform rotate-45" />
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Map title */}
      <div className="absolute top-3 left-3 text-sm font-medium text-gray-300 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-cyan-400" />
        Capteurs Océaniques
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Bon</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Moyen</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span>Critique</span>
        </div>
      </div>
    </div>
  );
}
