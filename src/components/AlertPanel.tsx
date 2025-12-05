"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/lib/oceanData";

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

export function AlertPanel({ alerts, onDismiss }: AlertPanelProps) {
  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          icon: AlertTriangle,
          iconColor: "text-red-400",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 border-amber-500/30",
          icon: AlertCircle,
          iconColor: "text-amber-400",
        };
      case "info":
        return {
          bg: "bg-blue-500/10 border-blue-500/30",
          icon: Info,
          iconColor: "text-blue-400",
        };
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
        <div className="text-3xl mb-2">✨</div>
        <p className="text-emerald-400 font-medium">Aucune alerte</p>
        <p className="text-sm text-gray-400 mt-1">Tous les systèmes sont nominaux</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert, index) => {
          const styles = getAlertStyles(alert.type);
          const Icon = styles.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative p-4 rounded-xl border backdrop-blur-sm",
                styles.bg
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", styles.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.location}</span>
                    <span className="text-gray-600">•</span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString("fr-FR")}</span>
                  </div>
                </div>
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Pulsing indicator for critical alerts */}
              {alert.type === "critical" && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-red-500/50"
                  animate={{ opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
