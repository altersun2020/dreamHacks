# IsleHelp

A resilient, social-first community platform for isolated coastal regions. IsleHelp improves resource accessibility, coordinates local and cross-water trade, and maintains connection during extreme conditions using offline-first architecture.

Built for **dreamHacks**.

## Features

### Island Stream & Tide Logs
- Dual-view feed: **My Isle** (hyper-local) and **Archipelago** (regional)
- Tag-driven post cards: `#ResourceOffer`, `#RideShare`, `#HazardAlert`, `#LocalMarket`, `#FairShare`
- Contextual action buttons: `[I Can Help]`, `[Claim Allocation]`, `[Hop on Boat]`
- 24-hour ephemeral Tide Logs for real-time announcements

### Archipelago Grid
- Interactive geospatial map with color-coded island status rings
- Cross-water trade negotiation interface
- Global sister-island knowledge network

### The Island Ledger
- Local business, food, ride, and artisan directory
- Fair Share ration system with household quota management
- Idle gear exchange for peer-to-peer lending

### Island Pulse
- Work party organization with live volunteer counters
- Micro-market day bulletins
- Gamified household badges

### Coastal Mobility
- Boat pool & water taxi scheduling
- Tide & weather alert tracker
- Low-bandwidth mesh sync foundation (IndexedDB + PWA)

### IsleSOS — Emergency & Crisis Alerts
- **Archipelago Beacon:** Island-wide distress signals with pulsing red map alerts
- **Personal SOS:** One-tap medical, safety, and missing-person dispatch with GPS pin drop
- **Hazard Reporting:** Infrastructure and ecological hazard pins on live IsleMap
- Offline queuing for SOS broadcasts via IndexedDB

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** — coastal-themed design system
- **Dexie.js** — IndexedDB for offline post caching and action queuing
- **Lucide React** — icons
- **PWA** — manifest, standalone display, offline-ready architecture

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the Island Stream.

## Project Structure

```
src/
├── app/
│   ├── stream/        # Island Stream & Tide Logs
│   ├── archipelago/   # Archipelago Grid & trade
│   ├── ledger/        # Directory, Fair Share, Gear Exchange
│   ├── pulse/         # Work parties, micro-markets, badges
│   ├── mobility/      # Boats, tides, weather, mesh sync
│   └── sos/           # IsleSOS emergency & crisis alerts
├── components/        # Shared UI components
└── lib/
    ├── types.ts       # Domain types
    ├── mock-data.ts   # Demo data for Cedar Cove archipelago
    ├── db.ts          # IndexedDB offline layer
    └── utils.ts       # Helpers
```

## Offline Architecture

IsleHelp caches posts to IndexedDB on load. User actions (help, claim, reserve) queue locally when offline and are designed to sync via mesh when connectivity returns. The PWA manifest enables home-screen installation for field use during outages.

## License

MIT
