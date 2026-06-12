# Todo Widget

Desktop widget — always-on-top todo list + notes app built with Tauri 2 + React 19 + TypeScript.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Backend:** Tauri 2 (Rust), SQLite via rusqlite
- **State:** Zustand
- **Package manager:** pnpm

## Project structure

```
src/                  # React frontend
src-tauri/            # Rust backend (Tauri)
src-tauri/src/lib.rs  # Tauri commands, app setup
src-tauri/src/main.rs # Entry point
```

## Known issues

- `time` crate must be pinned to 0.3.47: `cargo update time@0.3.48 --precise 0.3.47`
- Without this pin, E0119 coherence error between `cookie 0.18.1` and `tauri-utils 2.9.2`

## Build & run

```bash
pnpm install
pnpm tauri dev
```

## Conventions

- No em dashes, no emojis
- Minimal comments — only when WHY is non-obvious
- Prefer editing existing files over creating new ones
- Tailwind for styling, dark theme, minimalist UI
