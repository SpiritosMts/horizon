"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { metricInfo, OceanMetrics, HistoricalDataPoint } from "@/lib/oceanData";

interface MetricChartProps {
  metric: keyof OceanMetrics;
  historicalData: HistoricalDataPoint[];
  predictions?: HistoricalDataPoint[];
}

export function MetricChart({ metric, historicalData, predictions = [] }: MetricChartProps) {
  const info = metricInfo[metric];

  const chartData = useMemo(() => {
    const historical = historicalData.map((d) => ({
      time: d.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      value: d.value,
      type: "historical",
    }));

    const predicted = predictions.map((d) => ({
      time: d.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      prediction: d.value,
      type: "prediction",
    }));

    // Bridge the gap
    if (historical.length > 0 && predicted.length > 0) {
      predicted[0] = { ...predicted[0], prediction: historical[historical.length - 1].value };
    }

    return [...historical, ...predicted];
  }, [historicalData, predictions]);

  // Get ideal range for reference lines
  const getIdealRange = (): { min: number; max: number } | null => {
    switch (metric) {
      case "temperature": return { min: 14, max: 22 };
      case "ph": return { min: 7.8, max: 8.5 };
      case "oxygen": return { min: 6, max: 8 };
      case "pollution": return { min: 0, max: 30 };
      case "biodiversity": return { min: 60, max: 100 };
      case "coralHealth": return { min: 70, max: 100 };
      default: return null;
    }
  };

  const idealRange = getIdealRange();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{info.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-white">{info.label}</h3>
          <p className="text-sm text-gray-400">{info.description}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`prediction-gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            
            {/* Ideal range reference lines */}
            {idealRange && (
              <>
                <ReferenceLine
                  y={idealRange.min}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />
                <ReferenceLine
                  y={idealRange.max}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />
              </>
            )}

            {/* Historical data */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              fill={`url(#gradient-${metric})`}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />

            {/* Predictions */}
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-cyan-400" />
          <span className="text-gray-400">Données réelles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-400" style={{ backgroundImage: "repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 4px, transparent 4px, transparent 8px)" }} />
          <span className="text-gray-400">Prédictions</span>
        </div>
        {idealRange && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-400 opacity-50" style={{ backgroundImage: "repeating-linear-gradient(90deg, #22c55e 0, #22c55e 4px, transparent 4px, transparent 8px)" }} />
            <span className="text-gray-400">Zone idéale</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
