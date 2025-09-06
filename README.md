# Music Library Micro Frontend – Quick Start

This repository contains a micro frontend demo with two Vite + React apps:
- `main-app/` (Host/Container): Authentication, role-based access, Dashboard, and integration point.
- `music-library/` (Remote): Music library UI exposed via Module Federation.

## How to run locally

1) Clone and install
```
git clone <your-repo-url>
cd Assignment

# Install both apps
cd music-library && npm install
cd ../main-app && npm install
```

2) Start development servers (start remote first)
```
# Terminal A – Remote (music-library)
cd music-library
npm run dev   # http://localhost:5174

# Terminal B – Host (main-app)
cd main-app
npm run dev   # http://localhost:5173
```

3) Open the host in your browser
- Visit http://localhost:5173
- Log in using the demo credentials below

Notes
- The host dynamically loads the remote from http://localhost:5174/assets/remoteEntry.js
- If your setup serves `remoteEntry.js` at the root, update the host `vite.config.js` accordingly.

## How you deployed it

There are two separate deployments: one for the remote and one for the host.

Remote (music-library)
- Build: `npm run build` (outputs to `dist/`)
- Deploy to Vercel/Netlify with project root set to `music-library`
- After deploy, copy the public URL to `assets/remoteEntry.js` (e.g. https://your-remote.vercel.app/assets/remoteEntry.js)

Host (main-app)
- Configure the host with the remote URL via env var:
  - In `main-app/.env`: `VITE_MUSIC_LIB_REMOTE=https://your-remote.vercel.app/assets/remoteEntry.js`
- Build: `npm run build` (outputs to `dist/`)
- Deploy to Vercel/Netlify with project root set to `main-app`

Order of operations for first-time deploys
1) Deploy `music-library` and get its `remoteEntry.js` URL
2) Set `VITE_MUSIC_LIB_REMOTE` in `main-app`
3) Deploy `main-app`

## Credentials for demo

Admin
- Email/Username: admin@test.com
- Password: admin123
- Permissions: Can add and delete songs

User
- Email/Username: user@test.com
- Password: user123
- Permissions: View and filter songs only

## How it works: Micro Frontend + Role-Based Auth

Micro Frontend (Module Federation)
- The remote `music-library` exposes `./MusicLibrary` (mapped to `src/App.jsx`) via Module Federation in `music-library/vite.config.js` with `name: 'music-library'` and `filename: 'remoteEntry.js'`.
- The host `main-app` declares a remote mapping in `main-app/vite.config.js` under the same key `music-library` and lazy-loads with `import('music-library/MusicLibrary')` in `src/pages/Dashboard.jsx`.
- The host passes props to the remote: `songs`, `role`, `onAddSong`, `onDeleteSong`.
- The remote focuses on UI; mutations call host callbacks so state stays centralized in the host.

Role-Based Authentication
- `main-app/src/context/AuthContext.jsx` holds auth state, login/logout methods, and an `isAdmin()` helper.
- Demo users are validated against a small mock store; a mock JWT is saved in `localStorage`.
- `main-app/src/components/Protected.jsx` guards routes based on `user` and `user.role`.
- The host forwards `role` to the remote. The remote renders admin controls (add/delete) only when `role === 'admin'`; users see a read-only library with filtering, sorting, and grouping.

That’s it. Start the remote, then the host, and log in with the demo credentials to explore the micro frontend dashboard.
