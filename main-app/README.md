# Music Library Main App

A modern React application serving as the container for a micro frontend architecture. This app provides authentication, role-based access control, and integrates the Music Library remote component via Module Federation.

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

## 📦 Installation

1. **Clone the repository and navigate to main-app:**
   ```bash
   cd main-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   # Create .env file for production deployment
   VITE_MUSIC_LIB_REMOTE=https://your-music-library-app.vercel.app/assets/remoteEntry.js
   ```

## 🏃‍♂️ Development

**Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🔐 Authentication

The app includes a mock authentication system with the following test accounts:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Full access, can add/delete songs

### User Account
- **Username:** `user`
- **Password:** `user123`
- **Permissions:** View and filter songs only

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

## 🔧 Module Federation Configuration

The app is configured as a Module Federation host that consumes the Music Library remote:

```javascript
// vite.config.js
federation({
  name: 'main-app',
  remotes: {
    'music-library': process.env.VITE_MUSIC_LIB_REMOTE || 
                    'http://localhost:5174/assets/remoteEntry.js'
  }
})
```

## 🚀 Deployment

### Vercel Deployment

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Import your repository in Vercel
   - Set the root directory to `main-app`
   - Add environment variable: `VITE_MUSIC_LIB_REMOTE` with your music-library app URL

3. **Deploy:**
   - Vercel will automatically build and deploy your app
   - The build command is: `npm run build`
   - The output directory is: `dist`

### Netlify Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## 🔗 Integration with Music Library

The main app integrates with the music-library micro frontend by:

1. **Lazy Loading:** The MusicLibrary component is loaded dynamically
2. **Props Interface:** Passes songs data, user role, and callback functions
3. **State Management:** Manages the songs state and provides add/delete functionality
4. **Error Handling:** Shows loading states and error boundaries

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

## 🧪 Testing the Integration

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
- Check that the remote URL is correct in vite.config.js
- Verify the music-library app is exposing the MusicLibrary component

### Authentication Issues
- Check localStorage for stored JWT tokens
- Verify the mock user database in authHelpers.js
- Ensure proper role checking in Protected components

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
- Admin: `admin` / `admin123`
- User: `user` / `user123`

**Live Demo:** [Your deployed main-app URL]
**Music Library Remote:** [Your deployed music-library URL]
