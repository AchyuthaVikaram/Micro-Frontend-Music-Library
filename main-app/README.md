# Music Library – Main App (Container)

A modern React application that serves as the container in a micro frontend architecture. It provides authentication, role-based access control, and integrates the Music Library remote component via Module Federation.

## 🚀 Features

- **JWT Authentication**: Mock JWT-based authentication with role management
- **Role-Based Access**: Admin and User roles with different permissions
- **Micro Frontend Integration**: Dynamically loads the Music Library remote component
- **Modern UI**: Built with Tailwind CSS and Framer Motion animations
- **Responsive Design**: Fully responsive across all device sizes
- **Protected Routes**: Route guards based on authentication and roles

## 🛠️ Tech Stack

- **React 18** - UI library with functional components and hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Module Federation** - Micro frontend architecture
- **Lucide React** - Modern icon library

## 📦 How to Run Locally (Full Setup)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Assignment
   ```

2. **Install dependencies for BOTH apps**
   ```bash
   # Terminal A
   cd main-app && npm install
   
   # Terminal B
   cd music-library && npm install
   ```

3. **Start dev servers (start remote first)**
   ```bash
   # Terminal A (Host – main-app)
   npm run dev    # http://localhost:5173
   
   # Terminal B (Remote – music-library)
   npm run build
   npm run preview    # http://localhost:5174

   ```

4. **Open the container** at `http://localhost:5173` and log in using demo credentials below.

## 🏃‍♂️ Development Scripts (Main App)

- **Dev:** `npm run dev` → `http://localhost:5173`
- **Build:** `npm run build` → outputs to `dist/`
- **Preview:** `npm run preview` (serve the production build locally)

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

## 🏗️ Project Structure

```
main-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm.jsx     # Login form with preset credentials
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Protected.jsx    # Route protection component
│   │   └── Sidebar.jsx      # Collapsible sidebar navigation
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context provider
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard with music library
│   │   ├── Home.jsx         # Landing page
│   │   └── Login.jsx        # Login page
│   ├── utils/
│   │   └── authHelpers.js   # JWT utilities and mock authentication
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration with Module Federation
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design System

The app uses a carefully crafted dark theme with a music-inspired color palette:

- **Primary Colors:** Blue gradient (`#3B82F6` to `#1E40AF`)
- **Accent Colors:** Purple to pink gradient (`#8B5CF6` to `#EC4899`)
- **Dark Theme:** Various shades of dark gray/blue
- **Typography:** Modern, readable fonts with proper hierarchy

## 🔧 Micro Frontend: Module Federation Configuration

This app is the host that consumes the `music-library` remote.

```javascript
// vite.config.js
federation({
  name: 'mainApp',
  remotes: {
    'music-library': process.env.VITE_MUSIC_LIB_REMOTE || 'http://localhost:5174/assets/remoteEntry.js'
  },
  shared: ['react', 'react-dom']
})
```

How it works end-to-end:
- `music-library/vite.config.js` exposes `./MusicLibrary` which points to `src/App.jsx`.
- `main-app/src/pages/Dashboard.jsx` lazy-loads `import('music-library/MusicLibrary')`.
- Props passed from host to remote:
  - `songs` from `src/context/SongsContext.jsx`
  - `role` from `src/context/AuthContext.jsx`
  - `onAddSong` / `onDeleteSong` callbacks
- Remote renders UI only; all mutations call back into host via callbacks.

## 🚀 How We Deployed It

### Vercel – Main App (Host)

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Import your repository in Vercel
   - Set the root directory to `main-app`
   - Add env var: `VITE_MUSIC_LIB_REMOTE` pointing to your deployed music-library `remoteEntry.js` (e.g., `https://your-remote.vercel.app/assets/remoteEntry.js`)

3. **Deploy:**
   - Vercel will automatically build and deploy your app
   - The build command is: `npm run build`
   - The output directory is: `dist`

### Netlify – Main App (Host)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## 🔗 Integration with Music Library (Code Snippet)

The host lazy-loads the remote and passes data + callbacks:

```jsx
// Dashboard.jsx - Integration example
const MusicLibrary = lazy(() => import('music-library/MusicLibrary'));

<Suspense fallback={<LoadingSpinner />}>
  <MusicLibrary
    songs={songs}
    role={role}
    onAddSong={handleAddSong}
    onDeleteSong={handleDeleteSong}
  />
</Suspense>
```

## 🧪 Testing the Integration (Local)

1. **Start both applications:**
   ```bash
   # Terminal 1 - Main App
   cd main-app && npm run dev

   # Terminal 2 - Music Library
   cd music-library && npm run dev
   ```

2. **Login with test credentials**
3. **Navigate to Dashboard to see the integrated music library**
4. **Test role-based features (admin can add/delete, user can only view)**

## 🐛 Troubleshooting

### Module Federation Issues
- Ensure both apps are running on different ports
- Check that the remote URL is correct in `main-app/vite.config.js`
- Verify `music-library/vite.config.js` exposes `./MusicLibrary`
- If Vite overlay shows “failed to resolve import `music-library/MusicLibrary`”, verify the remote `name` is `music-library` and the host `remotes` key matches.

### Authentication Issues
- Check `localStorage` for stored JWT tokens
- Verify the mock user database in `src/utils/authHelpers.js`
- Ensure proper role checking in `src/components/Protected.jsx`

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check that custom CSS classes are defined in index.css
- Ensure Framer Motion animations are not conflicting

## 📝 License

This project is part of an internship assignment and is for educational purposes.

## 🤝 Contributing

This is an assignment project. For any issues or improvements, please contact the development team.

---

**Demo Credentials:**
- Admin: `admin@test.com` / `admin123`
- User: `user@test.com` / `user123`

**Live Demo:** [Your deployed main-app URL]
**Music Library Remote:** [Your deployed music-library URL]
