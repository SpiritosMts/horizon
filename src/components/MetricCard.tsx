"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMetricValue, metricInfo, OceanMetrics } from "@/lib/oceanData";

interface MetricCardProps {
  metric: keyof OceanMetrics;
  value: number;
  trend?: "up" | "down" | "stable";
  onClick?: () => void;
  selected?: boolean;
}

export function MetricCard({ metric, value, trend = "stable", onClick, selected }: MetricCardProps) {
  const info = metricInfo[metric];
  
  // Determine if value is in ideal range
  const getStatus = (): "good" | "warning" | "danger" => {
    switch (metric) {
      case "temperature":
        return value >= 14 && value <= 22 ? "good" : value >= 10 && value <= 26 ? "warning" : "danger";
      case "ph":
        return value >= 7.8 && value <= 8.5 ? "good" : value >= 7.5 && value <= 8.7 ? "warning" : "danger";
      case "oxygen":
        return value >= 6 ? "good" : value >= 4 ? "warning" : "danger";
      case "pollution":
        return value < 30 ? "good" : value < 50 ? "warning" : "danger";
      case "biodiversity":
        return value > 60 ? "good" : value > 40 ? "warning" : "danger";
      case "coralHealth":
        return value > 70 ? "good" : value > 50 ? "warning" : "danger";
      default:
        return "good";
    }
  };

  const status = getStatus();
  const statusColors = {
    good: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    warning: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
    danger: "from-red-500/20 to-red-600/10 border-red-500/30",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = 
    (metric === "pollution" || metric === "plasticDensity") 
      ? (trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-gray-400")
      : (trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400");

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm transition-all text-left",
        statusColors[status],
        selected && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900",
        onClick && "hover:scale-[1.02] cursor-pointer"
      )}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{info.icon}</span>
        <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="w-3 h-3" />
        </div>
      </div>
      
      <div className="text-xl font-bold text-white mb-1">
        {formatMetricValue(metric, value)}
      </div>
      
      <div className="text-sm text-gray-400">{info.label}</div>
      
      <div className="mt-2 text-xs text-gray-500">
        Idéal: {info.idealRange}
      </div>

      {/* Status indicator dot */}
      <div className={cn(
        "absolute top-3 right-3 w-2 h-2 rounded-full",
        status === "good" && "bg-emerald-400",
        status === "warning" && "bg-amber-400 animate-pulse",
        status === "danger" && "bg-red-400 animate-pulse"
      )} />
    </motion.button>
  );
}
