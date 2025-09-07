# Music Library – Main App (Container)

Minimal instructions to run locally and deploy on Netlify.

## Run locally

1) Update constants to localhost
- Edit `main-app/src/utils/constants.js` and set the remote base to `http://localhost:5174` (or set env `VITE_MUSIC_LIBRARY_URL=http://localhost:5174`).

2) Install deps (both apps)
```bash
git clone <your-repo-url>
cd Assignment
cd music-library && npm install
cd ../main-app && npm install
```

3) Start dev (start remote first)
```bash
# Terminal 1 – Remote
cd music-library && npm run dev   # http://localhost:5174

# Terminal 2 – Host
cd main-app && npm run dev        # http://localhost:5173
```

4) Open http://localhost:5173 and log in with the demo credentials below.

## Deploy (Netlify)

Site settings (project root = `main-app/`):
- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VITE_MUSIC_LIBRARY_URL=https://microfrontendmusiclibrary.netlify.app` (your remote origin)

SPA refresh 404 fix (optional): add `public/_redirects` with:
```
/*    /index.html   200
```

## 🔐 Demo Credentials & Role-Based Auth

The app includes a mock authentication system (Context + localStorage). Use these:

### Admin Account
- **Email/Username:** `admin@test.com`
- **Password:** `admin123`
- **Permissions:** Full access, can add/delete songs

### User Account
- **Email/Username:** `user@test.com`
- **Password:** `user123`
- **Permissions:** View and filter songs only

Implementation (high level):
- `src/context/AuthContext.jsx` holds auth state, `login/logout`, and `isAdmin()` helper.
- Credentials are validated against a small mock database; a mock JWT is stored in `localStorage`.
- `src/components/Protected.jsx` guards routes based on `user` and `user.role`.

## Deployed link and caveat

- Host: https://mainappmicrofronted.netlify.app/

Note: On refresh, deep links may 404 due to static SPA routing. Use the `_redirects` tip above, or run locally for the best experience.

## 🎨 Design System

The app uses a carefully crafted dark theme with a music-inspired color palette:

- **Primary Colors:** Blue gradient (`#3B82F6` to `#1E40AF`)
- **Accent Colors:** Purple to pink gradient (`#8B5CF6` to `#EC4899`)
- **Dark Theme:** Various shades of dark gray/blue
- **Typography:** Modern, readable fonts with proper hierarchy

## Demo credentials

- Admin: `admin@test.com` / `admin123`
- User: `user@test.com` / `user123`

## Notes

- This host consumes the remote via Module Federation. Ensure the remote URL set in `vite.config.js` or env variables is correct.
