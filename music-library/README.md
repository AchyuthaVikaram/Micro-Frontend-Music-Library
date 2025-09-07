# Music Library – Remote (Micro Frontend)

Minimal instructions to run locally and deploy on Netlify.

## Run locally

1) Update constants to localhost
- Edit `music-library/src/utils/constants.js` and set the host base to `http://localhost:5173` (or set env `VITE_MAIN_APP_URL=http://localhost:5173`).

2) Install deps
```bash
git clone <your-repo-url>
cd Assignment/music-library
npm install
```

3) Start dev (start this remote before the host)
```bash
npm run dev   # http://localhost:5174
```

If integrating locally, start the host in another terminal:
```bash
cd ../main-app && npm install && npm run dev   # http://localhost:5173
```

## Deploy (Netlify)

Site settings (project root = `music-library/`):
- Build command: `npm run build`
- Publish directory: `dist`
- Environment (optional): `VITE_MAIN_APP_URL=https://mainappmicrofronted.netlify.app`
- CORS headers: `music-library/netlify.toml` sets `Access-Control-Allow-Origin: *` for `/assets/*` so hosts can fetch `remoteEntry.js`.

## Deployed link and caveat

- Remote: https://microfrontendmusiclibrary.netlify.app/

Note: On refresh, deep links may 404 due to static SPA routing. Consider adding a `_redirects` file, or run locally for the best experience.

## Module Federation (expose)

This remote exposes `./MusicLibrary` (mapped to `src/App.jsx`) via Module Federation (`vite.config.js`). The host imports it using:
```js
import('music-library/MusicLibrary')
```
