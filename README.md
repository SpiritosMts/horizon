# 🌊 OcéanPulse - Système de Surveillance Océanique Intelligent

> **Nuit de l'Info 2025 - Défi "Horizon Connecté"**

## 📋 Description

OcéanPulse est un tableau de bord connecté qui centralise et analyse des données issues de capteurs océaniques simulés. Le système aide à **anticiper les événements environnementaux**, **optimiser les interventions** et **fournir des recommandations intelligentes** pour la préservation des océans.

### 🎯 Fonctionnalités Clés

- **Tableau de bord temps réel** avec visualisation des métriques océaniques
- **Carte interactive** des capteurs avec état de santé par zone
- **Système d'alertes intelligent** avec priorisation (critique/warning/info)
- **Prédictions IA** basées sur l'analyse des tendances historiques
- **Avatar océan animé** qui réagit selon l'état de santé global (le bonus décalé ! 🎭)
- **Recommandations automatiques** d'actions à entreprendre

### 📊 Métriques Surveillées

| Métrique | Description | Plage Idéale |
|----------|-------------|--------------|
| 🌡️ Température | Température de l'eau | 14-22°C |
| 🧪 pH | Niveau d'acidité | 7.8-8.5 |
| 💨 Oxygène | Oxygène dissous | 6-8 mg/L |
| 🧂 Salinité | Concentration en sel | 33-37 PSU |
| 🏭 Pollution | Indice de pollution | <20/100 |
| 🐠 Biodiversité | Indice de biodiversité | >70/100 |
| ♻️ Plastique | Densité microplastiques | <50 p/m³ |
| 🪸 Coraux | Santé des récifs | >80% |

## 🛠️ Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Graphiques**: Recharts
- **Icônes**: Lucide React

## 🚀 Installation

```bash
# Cloner le projet
git clone <repo-url>
cd horizon

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🎭 Le Bonus Décalé

L'océan vous parle ! Notre avatar océanique animé change d'humeur selon son état de santé :
- 🌊✨ **Extatique** (90+) : "Je suis en pleine forme ! Mes récifs coralliens dansent de joie !"
- 🌊😊 **Heureux** (75-89) : "Ça va plutôt bien ! Continuez comme ça, les humains !"
- 🌊😐 **Neutre** (60-74) : "Hmm, j'ai connu de meilleurs jours..."
- 🌊😟 **Inquiet** (40-59) : "Aïe... J'ai mal à mes coraux."
- 🌊😠 **En colère** (20-39) : "SÉRIEUSEMENT ?! Arrêtez de me jeter vos déchets !"
- 🌊💀 **Critique** (<20) : "MAYDAY MAYDAY ! Code rouge !"

## 📁 Structure du Projet

```
src/
├── app/
│   ├── page.tsx          # Dashboard principal
│   ├── layout.tsx        # Layout racine
│   └── globals.css       # Styles globaux
├── components/
│   ├── OceanAvatar.tsx   # Avatar animé de l'océan
│   ├── MetricCard.tsx    # Cartes de métriques
│   ├── MetricChart.tsx   # Graphiques avec prédictions
│   ├── AlertPanel.tsx    # Panneau d'alertes
│   └── SensorMap.tsx     # Carte des capteurs
└── lib/
    ├── oceanData.ts      # Simulation & logique métier
    └── utils.ts          # Utilitaires
```

## 🏆 Critères d'Évaluation

| Critère | Notre Approche |
|---------|----------------|
| **Simplicité** | Interface intuitive, navigation claire, données lisibles |
| **Efficacité** | Temps réel, alertes priorisées, actions recommandées |
| **Pertinence technique** | Stack moderne, code TypeScript typé, architecture modulaire |
| **Bonus technique** | Prédictions IA, animations fluides, design responsive |
| **Bonus décalé** | L'océan qui vous parle avec ses émotions ! |

## 👥 Équipe

Nuit de l'Info 2025 - Défi Horizon Connecté

---

*"Parce que l'océan mérite qu'on l'écoute"* 🌊
