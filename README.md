# Doichain Halving Countdown

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-fhxvrwy5)

Ein Echtzeit-Countdown bis zum nächsten Doichain Block-Reward Halving. Die Anwendung zeigt detaillierte Blockchain-Informationen und berechnet das voraussichtliche Datum des nächsten Halvings basierend auf Live-Daten der Doichain-Blockchain.

## Features

- **Echtzeit-Countdown**: Live-Anzeige der verbleibenden Zeit bis zum nächsten Halving
- **Live Blockchain-Daten**: Aktuelle Informationen zu Block-Höhe, Difficulty und Hashrate
- **Block-Reward Informationen**: Anzeige des aktuellen und kommenden Block-Rewards
- **Hashrate-Anpassung**: Option zur Berücksichtigung steigender Hashrate bei der Datumsprognose
- **Responsive Design**: Optimiert für Desktop- und Mobile-Geräte
- **Moderne UI**: Glasmorphismus-Design mit sanften Animationen

## Technologie-Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **Lucide React** für Icons
- **Supabase Edge Functions** als Proxy für Doichain RPC-Aufrufe

## Architektur

Die Anwendung nutzt eine Supabase Edge Function als Proxy, um Cross-Origin-Probleme zu vermeiden und die Doichain-RPC-API sicher aufzurufen. Die Edge Function ruft die folgenden RPC-Befehle ab:

- `getblockcount`: Aktuelle Block-Höhe
- `getdifficulty`: Mining-Difficulty
- `hashrate`: Netzwerk-Hashrate

## Installation

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Supabase-Projekt mit Edge Functions

### Setup

1. Repository klonen:
```bash
git clone https://github.com/ottmar-neuburger/doichain-halving-countdown.git
cd doichain-halving-countdown
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
Erstelle eine `.env`-Datei im Projektstamm:
```env
VITE_SUPABASE_URL=deine-supabase-url
VITE_SUPABASE_ANON_KEY=dein-supabase-anon-key
```

4. Edge Function deployen:
Die Edge Function `doichain-proxy` muss in deinem Supabase-Projekt bereitgestellt werden.

5. Entwicklungsserver starten:
```bash
npm run dev
```

## Verwendung

Die Anwendung lädt automatisch die aktuellen Blockchain-Daten und aktualisiert sie jede Minute. Der Countdown wird jede Sekunde aktualisiert.

### Hashrate-Anpassung

Aktiviere die Checkbox "Für steigende Hashrate anpassen", um eine konservativere Schätzung zu erhalten, die eine potenzielle Erhöhung der Netzwerk-Hashrate berücksichtigt (5% Reduktion der geschätzten Zeit).

## Technische Details

### Halving-Parameter

- **Halving-Intervall**: 210.000 Blöcke
- **Initialer Block-Reward**: 50 DOI
- **Durchschnittliche Blockzeit**: 10 Minuten (600 Sekunden)

### Berechnung

Das nächste Halving-Event tritt bei Block-Höhe auf, die ein Vielfaches von 210.000 ist. Die verbleibende Zeit wird basierend auf:
1. Verbleibenden Blöcken bis zum Halving
2. Durchschnittlicher Blockzeit von 10 Minuten
3. Optional: Anpassung für steigende Hashrate (-5%)

## Entwicklung

### Build für Produktion

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type-Checking

```bash
npm run typecheck
```

## Deployment

Die Anwendung kann auf beliebigen Static-Hosting-Plattformen deployed werden:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Stelle sicher, dass die Umgebungsvariablen in der Deployment-Plattform konfiguriert sind.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für weitere Informationen.

## Haftungsausschluss

Alle Angaben ohne Gewähr. Die bereitgestellten Informationen dienen ausschließlich zu Informationszwecken und stellen keine Anlageberatung dar. Für die Richtigkeit, Vollständigkeit und Aktualität der Daten wird keine Haftung übernommen.

## Copyright

Copyright © 2026 Ottmar Neuburger

## Beiträge

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue für Vorschläge und Fehlerberichte.

## Links

- [Doichain Website](https://doichain.org)
- [Doichain GitHub](https://github.com/Doichain)
