# Todo Widget

A lightweight always-on-top desktop widget for managing tasks and notes. Built with Tauri 2 + React 19.

## Features

- Always-on-top window with system tray support
- Task management with priorities (must have / can wait / it's ok)
- Inline task details with description
- Date and recurring task support
- Local-first storage with SQLite
- Dark minimal UI

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS
- **Backend:** Tauri 2 (Rust), SQLite
- **State:** Zustand

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- [Rust](https://rustup.rs/) 1.88+

### Install & Run

```bash
pnpm install
pnpm tauri dev
```

### Build

```bash
pnpm tauri build
```

## Roadmap

- [x] Project setup (Tauri + React)
- [ ] Task CRUD with priorities
- [ ] Inline task expansion with description
- [ ] SQLite storage
- [ ] Always-on-top + system tray
- [ ] Sort & filter
- [ ] Notes tab
- [ ] Supabase sync
- [ ] PWA mobile version

## License

MIT
