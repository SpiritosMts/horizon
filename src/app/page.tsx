"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Waves, 
  RefreshCw, 
  Activity, 
  Bell, 
  Settings,
  Zap,
  Clock
} from "lucide-react";
import { OceanAvatar } from "@/components/OceanAvatar";
import { MetricCard } from "@/components/MetricCard";
import { AlertPanel } from "@/components/AlertPanel";
import { MetricChart } from "@/components/MetricChart";
import { SensorMap } from "@/components/SensorMap";
import {
  generateSensorData,
  generateAlerts,
  generateHistoricalData,
  predictMetric,
  calculateHealthScore,
  OceanMetrics,
  SensorLocation,
  Alert,
} from "@/lib/oceanData";

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorLocation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<keyof OceanMetrics>("temperature");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData("temperature"));
  const [predictions, setPredictions] = useState(predictMetric(historicalData, 6));

  // Calculate global health score
  const globalHealthScore = sensorData.length > 0
    ? Math.round(sensorData.reduce((acc, loc) => acc + calculateHealthScore(loc.metrics), 0) / sensorData.length)
    : 75;

  // Get selected location data
  const currentLocation = selectedLocation 
    ? sensorData.find(l => l.id === selectedLocation) 
    : sensorData[0];

  // Refresh data function
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newData = generateSensorData();
      setSensorData(newData);
      setAlerts(generateAlerts(newData));
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Update chart when metric changes
  useEffect(() => {
    const newHistorical = generateHistoricalData(selectedMetric);
    setHistoricalData(newHistorical);
    setPredictions(predictMetric(newHistorical, 6));
  }, [selectedMetric]);

  // Initialize and auto-refresh data
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  // Dismiss alert
  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-wave" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-wave" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                OcéanPulse
              </h1>
              <p className="text-sm text-gray-400">
                Système de surveillance océanique intelligent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">
                {lastUpdate.toLocaleTimeString("fr-FR")}
              </span>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {alerts.length}
                </span>
              )}
            </button>
            <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Ocean Avatar & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            <OceanAvatar healthScore={globalHealthScore} />

            {/* Quick Stats */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Statistiques Rapides
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Capteurs actifs</span>
                  <span className="text-sm font-semibold text-emerald-400">{sensorData.length}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Alertes actives</span>
                  <span className="text-sm font-semibold text-amber-400">{alerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Zones critiques</span>
                  <span className="text-sm font-semibold text-red-400">
                    {sensorData.filter(l => calculateHealthScore(l.metrics) < 50).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Prédictions IA</span>
                  <span className="text-sm font-semibold text-purple-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Actives
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Column - Metrics & Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Sensor Map */}
            <SensorMap
              locations={sensorData}
              selectedLocation={selectedLocation || undefined}
              onSelectLocation={setSelectedLocation}
            />

            {/* Metrics Grid */}
            {currentLocation && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                  metric="temperature"
                  value={currentLocation.metrics.temperature}
                  trend={currentLocation.metrics.temperature > 20 ? "up" : "stable"}
                  onClick={() => setSelectedMetric("temperature")}
                  selected={selectedMetric === "temperature"}
                />
                <MetricCard
                  metric="ph"
                  value={currentLocation.metrics.ph}
                  trend={currentLocation.metrics.ph < 8 ? "down" : "stable"}
                  onClick={() => setSelectedMetric("ph")}
                  selected={selectedMetric === "ph"}
                />
                <MetricCard
                  metric="oxygen"
                  value={currentLocation.metrics.oxygen}
                  onClick={() => setSelectedMetric("oxygen")}
                  selected={selectedMetric === "oxygen"}
                />
                <MetricCard
                  metric="pollution"
                  value={currentLocation.metrics.pollution}
                  trend={currentLocation.metrics.pollution > 40 ? "up" : "down"}
                  onClick={() => setSelectedMetric("pollution")}
                  selected={selectedMetric === "pollution"}
                />
                <MetricCard
                  metric="biodiversity"
                  value={currentLocation.metrics.biodiversity}
                  onClick={() => setSelectedMetric("biodiversity")}
                  selected={selectedMetric === "biodiversity"}
                />
                <MetricCard
                  metric="coralHealth"
                  value={currentLocation.metrics.coralHealth}
                  onClick={() => setSelectedMetric("coralHealth")}
                  selected={selectedMetric === "coralHealth"}
                />
                <MetricCard
                  metric="salinity"
                  value={currentLocation.metrics.salinity}
                  onClick={() => setSelectedMetric("salinity")}
                  selected={selectedMetric === "salinity"}
                />
                <MetricCard
                  metric="plasticDensity"
                  value={currentLocation.metrics.plasticDensity}
                  trend={currentLocation.metrics.plasticDensity > 100 ? "up" : "down"}
                  onClick={() => setSelectedMetric("plasticDensity")}
                  selected={selectedMetric === "plasticDensity"}
                />
              </div>
            )}

            {/* Chart */}
            <MetricChart
              metric={selectedMetric}
              historicalData={historicalData}
              predictions={predictions}
            />
          </motion.div>

          {/* Right Column - Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Alertes
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-gray-300">
                {alerts.filter(a => a.type === "critical").length} critiques
              </span>
            </div>
            <AlertPanel alerts={alerts} onDismiss={dismissAlert} />

            {/* Recommendations Panel */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20">
              <h3 className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recommandations IA
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {globalHealthScore < 60 && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Augmenter la fréquence de surveillance des zones critiques
                  </li>
                )}
                {alerts.some(a => a.metric === "pollution") && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Déclencher une intervention de nettoyage prioritaire
                  </li>
                )}
                {alerts.some(a => a.metric === "coralHealth") && (
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Activer le programme de restauration corallienne
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Prochaine mise à jour prédictive dans 30 min
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 pt-6 border-t border-slate-800"
        >
          <p>
            🌊 OcéanPulse - Nuit de l&apos;Info 2025 | Horizon Connecté
          </p>
          <p className="text-xs mt-1 text-gray-600">
            Données simulées à des fins de démonstration
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
