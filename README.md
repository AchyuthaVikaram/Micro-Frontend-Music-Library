# Music Library Micro Frontend – Quick Start

This repository contains a micro frontend demo with two Vite + React apps:
- `main-app/` (Host/Container): Authentication, role-based access, Dashboard, and integration point.
- `music-library/` (Remote): Music library UI exposed via Module Federation.

Both apps are fully responsive across devices (mobile, tablet, desktop).

## How to run locally

1) Update constants to use localhost URLs
- In `main-app/src/utils/constants.js`, set `BASE_URL` (or `VITE_MUSIC_LIBRARY_URL`) to `http://localhost:5174`
- In `music-library/src/utils/constants.js`, set `BASE_URL` (or `VITE_MAIN_APP_URL`) to `http://localhost:5173`

2) Install dependencies
```
git clone <your-repo-url>
cd Assignment

# Install both apps
cd music-library && npm install
cd ../main-app && npm install
```

3) Start development servers (start remote first)
```
# Terminal A – Remote (music-library)
cd music-library
npm run dev   # http://localhost:5174

# Terminal B – Host (main-app)
cd main-app
npm run dev   # http://localhost:5173
```

4) Open the host in your browser
- Visit http://localhost:5173
- Log in using the demo credentials below

Notes
- The host dynamically loads the remote from `http://localhost:5174/assets/remoteEntry.js`
- If your setup serves `remoteEntry.js` at a different path, update the host `main-app/vite.config.js` remote URL accordingly.

## How we deployed it (Netlify)

There are two separate Netlify sites: one for the remote and one for the host.

Remote (music-library)
- Project root: `music-library/`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment (optional): set `VITE_MAIN_APP_URL` to the host origin (e.g. `https://mainappmicrofronted.netlify.app`)
- CORS headers: `music-library/netlify.toml` includes `Access-Control-Allow-Origin: *` for `/assets/*`

Host (main-app)
- Project root: `main-app/`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: set `VITE_MUSIC_LIBRARY_URL` to the remote origin (e.g. `https://microfrontendmusiclibrary.netlify.app`)

Order of operations for first-time deploys
1) Deploy `music-library` and confirm `https://<remote-site>/assets/remoteEntry.js` is accessible
2) In `main-app` Netlify site settings, set `VITE_MUSIC_LIBRARY_URL=https://<remote-site>` (without trailing slash)
3) Deploy `main-app`

Optional (SPA 404 fixes)
- Netlify SPA refresh 404 can be avoided by adding a `_redirects` file or `netlify.toml` with:
  - `/*    /index.html   200`
- This repo includes a `netlify.toml` for the remote; you can add a similar one for the host if needed.

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

## Deployed links and caveats

- Host (main-app): https://mainappmicrofronted.netlify.app/
- Remote (music-library): https://microfrontendmusiclibrary.netlify.app/

Note: The deployed links are currently a bit clumsy and, on refresh, you may see a 404 due to static SPA routing behavior. For the best experience, please run the apps locally using the steps above.
