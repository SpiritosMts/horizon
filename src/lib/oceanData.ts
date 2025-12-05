// Simulated ocean sensor data generator
export interface OceanMetrics {
  temperature: number; // °C (ideal: 15-20)
  ph: number; // pH level (ideal: 8.1-8.4)
  oxygen: number; // mg/L (ideal: 6-8)
  salinity: number; // PSU (ideal: 33-37)
  pollution: number; // index 0-100 (ideal: <20)
  biodiversity: number; // index 0-100 (ideal: >70)
  plasticDensity: number; // particles/m³
  coralHealth: number; // percentage
}

export interface SensorLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  metrics: OceanMetrics;
  trend: "improving" | "stable" | "declining";
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  location: string;
  timestamp: Date;
  metric: keyof OceanMetrics;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
}

// Generate realistic fluctuating data
function fluctuate(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

// Calculate ocean health score (0-100)
export function calculateHealthScore(metrics: OceanMetrics): number {
  const tempScore = metrics.temperature >= 14 && metrics.temperature <= 22 ? 100 : Math.max(0, 100 - Math.abs(metrics.temperature - 18) * 10);
  const phScore = metrics.ph >= 7.8 && metrics.ph <= 8.5 ? 100 : Math.max(0, 100 - Math.abs(metrics.ph - 8.2) * 50);
  const oxygenScore = Math.min(100, (metrics.oxygen / 8) * 100);
  const pollutionScore = 100 - metrics.pollution;
  const biodiversityScore = metrics.biodiversity;
  const coralScore = metrics.coralHealth;

  return Math.round(
    tempScore * 0.15 +
    phScore * 0.2 +
    oxygenScore * 0.15 +
    pollutionScore * 0.2 +
    biodiversityScore * 0.15 +
    coralScore * 0.15
  );
}

// Get mood based on health score
export function getOceanMood(healthScore: number): {
  mood: "ecstatic" | "happy" | "neutral" | "worried" | "angry" | "critical";
  emoji: string;
  message: string;
  color: string;
} {
  if (healthScore >= 90) return { mood: "ecstatic", emoji: "🌊✨", message: "Je suis en pleine forme ! Mes récifs coralliens dansent de joie !", color: "#10b981" };
  if (healthScore >= 75) return { mood: "happy", emoji: "🌊😊", message: "Ça va plutôt bien ! Continuez comme ça, les humains !", color: "#22c55e" };
  if (healthScore >= 60) return { mood: "neutral", emoji: "🌊😐", message: "Hmm, j'ai connu de meilleurs jours... mais ça pourrait être pire.", color: "#eab308" };
  if (healthScore >= 40) return { mood: "worried", emoji: "🌊😟", message: "Aïe... J'ai mal à mes coraux. Un peu d'aide serait bienvenue !", color: "#f97316" };
  if (healthScore >= 20) return { mood: "angry", emoji: "🌊😠", message: "SÉRIEUSEMENT ?! Arrêtez de me jeter vos déchets !", color: "#ef4444" };
  return { mood: "critical", emoji: "🌊💀", message: "MAYDAY MAYDAY ! Code rouge ! Situation critique !", color: "#dc2626" };
}

// Sensor locations around the world
const baseLocations: Omit<SensorLocation, "metrics" | "trend">[] = [
  { id: "med-1", name: "Méditerranée - Côte d'Azur", lat: 43.7, lng: 7.26 },
  { id: "atl-1", name: "Atlantique - Bretagne", lat: 48.4, lng: -4.48 },
  { id: "pac-1", name: "Pacifique - Polynésie", lat: -17.5, lng: -149.8 },
  { id: "car-1", name: "Caraïbes - Guadeloupe", lat: 16.25, lng: -61.55 },
  { id: "ind-1", name: "Océan Indien - Réunion", lat: -21.1, lng: 55.5 },
];

// Generate sensor data
export function generateSensorData(): SensorLocation[] {
  return baseLocations.map((loc) => {
    const pollution = fluctuate(25, 30);
    const metrics: OceanMetrics = {
      temperature: fluctuate(18, 6),
      ph: fluctuate(8.1, 0.4),
      oxygen: fluctuate(7, 2),
      salinity: fluctuate(35, 4),
      pollution: Math.max(0, Math.min(100, pollution)),
      biodiversity: Math.max(0, Math.min(100, fluctuate(65, 30))),
      plasticDensity: Math.max(0, fluctuate(150, 100)),
      coralHealth: Math.max(0, Math.min(100, fluctuate(70, 25))),
    };

    const healthScore = calculateHealthScore(metrics);
    const trend = healthScore > 70 ? "improving" : healthScore > 50 ? "stable" : "declining";

    return { ...loc, metrics, trend };
  });
}

// Generate historical data for charts
export function generateHistoricalData(metric: keyof OceanMetrics, hours: number = 24): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  
  const baseValues: Record<keyof OceanMetrics, { base: number; range: number }> = {
    temperature: { base: 18, range: 3 },
    ph: { base: 8.1, range: 0.2 },
    oxygen: { base: 7, range: 1.5 },
    salinity: { base: 35, range: 2 },
    pollution: { base: 25, range: 15 },
    biodiversity: { base: 65, range: 10 },
    plasticDensity: { base: 150, range: 50 },
    coralHealth: { base: 70, range: 8 },
  };

  const { base, range } = baseValues[metric];
  let currentValue = base;

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    currentValue = currentValue + (Math.random() - 0.5) * range * 0.3;
    currentValue = Math.max(base - range, Math.min(base + range, currentValue));
    data.push({ timestamp, value: Number(currentValue.toFixed(2)) });
  }

  return data;
}

// Generate alerts based on metrics
export function generateAlerts(locations: SensorLocation[]): Alert[] {
  const alerts: Alert[] = [];
  
  locations.forEach((loc) => {
    const m = loc.metrics;
    
    if (m.temperature > 24) {
      alerts.push({
        id: `${loc.id}-temp-${Date.now()}`,
        type: "critical",
        message: `Température critique : ${m.temperature.toFixed(1)}°C - Risque de blanchissement corallien`,
        location: loc.name,
        timestamp: new Date(),
        metric: "temperature",
      });
    } else if (m.temperature > 22) {
      alerts.push({
        id: `${loc.id}-temp-warn-${Date.now()}`,
        type: "warning",
        message: `Température élevée : ${m.temperature.toFixed(1)}°C`,
        location: loc.name,
        timestamp: new Date(),
        metric: "temperature",
      });
    }

    if (m.ph < 7.8) {
      alerts.push({
        id: `${loc.id}-ph-${Date.now()}`,
        type: "critical",
        message: `Acidification détectée : pH ${m.ph.toFixed(2)} - Danger pour la vie marine`,
        location: loc.name,
        timestamp: new Date(),
        metric: "ph",
      });
    }

    if (m.pollution > 60) {
      alerts.push({
        id: `${loc.id}-poll-${Date.now()}`,
        type: "critical",
        message: `Pollution critique : indice ${m.pollution.toFixed(0)}`,
        location: loc.name,
        timestamp: new Date(),
        metric: "pollution",
      });
    } else if (m.pollution > 40) {
      alerts.push({
        id: `${loc.id}-poll-warn-${Date.now()}`,
        type: "warning",
        message: `Pollution modérée : indice ${m.pollution.toFixed(0)}`,
        location: loc.name,
        timestamp: new Date(),
        metric: "pollution",
      });
    }

    if (m.coralHealth < 40) {
      alerts.push({
        id: `${loc.id}-coral-${Date.now()}`,
        type: "critical",
        message: `Santé des coraux critique : ${m.coralHealth.toFixed(0)}%`,
        location: loc.name,
        timestamp: new Date(),
        metric: "coralHealth",
      });
    }
  });

  return alerts.sort((a, b) => {
    const priority = { critical: 0, warning: 1, info: 2 };
    return priority[a.type] - priority[b.type];
  });
}

// Prediction engine - simple trend-based
export function predictMetric(historicalData: HistoricalDataPoint[], hoursAhead: number = 6): HistoricalDataPoint[] {
  if (historicalData.length < 2) return [];
  
  const predictions: HistoricalDataPoint[] = [];
  const lastValue = historicalData[historicalData.length - 1].value;
  const trend = (historicalData[historicalData.length - 1].value - historicalData[0].value) / historicalData.length;
  
  const lastTime = historicalData[historicalData.length - 1].timestamp.getTime();
  
  for (let i = 1; i <= hoursAhead; i++) {
    const predictedValue = lastValue + trend * i + (Math.random() - 0.5) * 0.5;
    predictions.push({
      timestamp: new Date(lastTime + i * 60 * 60 * 1000),
      value: Number(predictedValue.toFixed(2)),
    });
  }
  
  return predictions;
}

// Format metric value with unit
export function formatMetricValue(metric: keyof OceanMetrics, value: number): string {
  const formats: Record<keyof OceanMetrics, (v: number) => string> = {
    temperature: (v) => `${v.toFixed(1)}°C`,
    ph: (v) => `pH ${v.toFixed(2)}`,
    oxygen: (v) => `${v.toFixed(1)} mg/L`,
    salinity: (v) => `${v.toFixed(1)} PSU`,
    pollution: (v) => `${v.toFixed(0)}/100`,
    biodiversity: (v) => `${v.toFixed(0)}/100`,
    plasticDensity: (v) => `${v.toFixed(0)} p/m³`,
    coralHealth: (v) => `${v.toFixed(0)}%`,
  };
  return formats[metric](value);
}

// Metric labels and descriptions
export const metricInfo: Record<keyof OceanMetrics, { label: string; description: string; icon: string; idealRange: string }> = {
  temperature: { label: "Température", description: "Température de l'eau", icon: "🌡️", idealRange: "14-22°C" },
  ph: { label: "pH", description: "Niveau d'acidité", icon: "🧪", idealRange: "7.8-8.5" },
  oxygen: { label: "Oxygène", description: "Oxygène dissous", icon: "💨", idealRange: "6-8 mg/L" },
  salinity: { label: "Salinité", description: "Concentration en sel", icon: "🧂", idealRange: "33-37 PSU" },
  pollution: { label: "Pollution", description: "Indice de pollution", icon: "🏭", idealRange: "<20" },
  biodiversity: { label: "Biodiversité", description: "Indice de biodiversité", icon: "🐠", idealRange: ">70" },
  plasticDensity: { label: "Plastique", description: "Densité microplastiques", icon: "♻️", idealRange: "<50 p/m³" },
  coralHealth: { label: "Coraux", description: "Santé des récifs", icon: "🪸", idealRange: ">80%" },
};
