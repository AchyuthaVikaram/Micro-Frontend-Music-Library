# Music Library – Remote Component (Micro Frontend)

A React micro frontend component that provides a complete music library interface with filtering, sorting, and grouping capabilities. This component is designed to be consumed by other applications via Module Federation.

## 🚀 Features

- **Advanced Filtering**: Search songs by title, artist, album, or genre
- **Multiple Sorting Options**: Sort by title, artist, album, year, or duration
- **Smart Grouping**: Group songs by album, artist, genre, year, or decade
- **Role-Based UI**: Different interfaces for admin and user roles
- **Responsive Design**: Fully responsive grid layout with smooth animations
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **Add/Delete Songs**: Admin functionality for managing the music collection

## 🛠️ Tech Stack

- **React 18** - UI library with functional components and hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation and transition library
- **Module Federation** - Micro frontend architecture
- **Lucide React** - Modern icon library
- **JavaScript Array Methods** - Extensive use of map, filter, reduce

## 📦 How to Run Locally

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd Assignment/music-library
   npm install
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃‍♂️ Development

**Start the development server (Remote first):**
```bash
npm run dev
```

The remote will be available at `http://localhost:5174`.

If you're integrating with the host (main-app) locally, start the host in another terminal:
```bash
cd ../main-app
npm install
npm run dev  # http://localhost:5173
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

This serves the built remote at a local URL so you can validate `remoteEntry.js` and assets.

## 🏗️ Project Structure

```
music-library/
├── src/
│   ├── components/          # UI components
│   │   ├── FilterBar.jsx    # Search, sort, and filter controls
│   │   ├── GroupedSongs.jsx # Collapsible grouped song display
│   │   └── SongCard.jsx     # Individual song card component
│   ├── utils/               # Utility functions using array methods
│   │   ├── filterSongs.js   # Filter functions using filter()
│   │   ├── groupSongs.js    # Grouping functions using reduce()
│   │   └── sortSongs.js     # Sorting functions using sort()
│   ├── App.jsx              # Main MusicLibrary component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration with Module Federation
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Component API

The main `MusicLibrary` component accepts the following props:

```jsx
<MusicLibrary
  songs={[]}           // Array of song objects
  role="user"          // "admin" or "user"
  onAddSong={fn}       // Callback for adding songs (admin only)
  onDeleteSong={fn}    // Callback for deleting songs (admin only)
/>
```

### Song Object Structure

```javascript
{
  id: number,          // Unique identifier
  title: string,       // Song title
  artist: string,      // Artist name
  album: string,       // Album name
  duration: string,    // Duration (e.g., "3:45")
  year: number,        // Release year
  genre: string        // Music genre
}
```

## 🎯 Core Functionality

### Filtering (filterSongs.js)
Uses JavaScript `filter()` method for:
- Text search across title, artist, album, genre
- Case-insensitive matching
- Multiple field filtering

```javascript
// Example: Filter songs by search query
const filteredSongs = filterSongsByQuery(songs, "bohemian");
```

### Sorting (sortSongs.js)
Uses JavaScript `sort()` method for:
- Alphabetical sorting (title, artist, album, genre)
- Numerical sorting (year, duration)
- Custom comparison functions

```javascript
// Example: Sort songs by year (newest first)
const sortedSongs = sortSongs(songs, "year");
```

### Grouping (groupSongs.js)
Uses JavaScript `reduce()` method for:
- Grouping by album, artist, genre, year
- Decade-based grouping
- Converting grouped objects to arrays

```javascript
// Example: Group songs by album
const groupedSongs = groupSongs(songs, "album");
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#3B82F6` to `#1E40AF`)
- **Accent**: Purple to pink gradient (`#8B5CF6` to `#EC4899`)
- **Background**: Dark theme with multiple gray shades
- **Text**: White primary, gray secondary

### Animations
- **Stagger animations** for song lists
- **Hover effects** on interactive elements
- **Smooth transitions** for state changes
- **Loading animations** for better UX

### Responsive Grid
```css
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

## 🔧 Module Federation Setup

The component is exposed via Module Federation:

```javascript
// vite.config.js
federation({
  name: 'music-library',
  filename: 'remoteEntry.js',
  exposes: {
    './MusicLibrary': './src/App.jsx'
  },
  shared: ['react', 'react-dom']
})
```

How it integrates with the host:
- Host `main-app` maps the remote in `vite.config.js` under the same key `music-library`.
- Host lazy-loads it via `import('music-library/MusicLibrary')`.
- Host passes props: `songs`, `role`, `onAddSong`, `onDeleteSong`.
- Remote renders UI only; mutations call host callbacks so state stays centralized in the host.

Role-based behavior note:
- The remote receives the current role via `role` prop from the host.
- Admin role renders add/delete controls; user role renders read-only UI.

## 🚀 How We Deployed It

### Vercel – Remote (music-library)

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Import your repository in Vercel
   - Set the root directory to `music-library`
   - No environment variables are required for the remote

3. **Deploy:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - After deploy, note the URL to `https://<your-remote-domain>/assets/remoteEntry.js`
   - Configure the host env var `VITE_MUSIC_LIB_REMOTE` to point to that URL

### Netlify – Remote (music-library)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - After deploy, copy the full `remoteEntry.js` URL and update the host env var

## 🧪 Testing Standalone

The component can run independently for testing:

```bash
npm run dev
```

This shows the component with default sample songs and full functionality. Role-based restrictions are best tested via the host app which sends the `role` prop.

Demo credentials (in host app):
- Admin: `admin@test.com` / `admin123`
- User: `user@test.com` / `user123`

## 🔗 Integration Example

```jsx
// In the consuming application
import { lazy, Suspense } from 'react';

const MusicLibrary = lazy(() => import('music-library/MusicLibrary'));

function Dashboard() {
  const [songs, setSongs] = useState([]);
  
  const handleAddSong = (newSong) => {
    setSongs(prev => [...prev, { ...newSong, id: Date.now() }]);
  };
  
  const handleDeleteSong = (songId) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
  };
  
  return (
    <Suspense fallback={<div>Loading Music Library...</div>}>
      <MusicLibrary
        songs={songs}
        role="admin"
        onAddSong={handleAddSong}
        onDeleteSong={handleDeleteSong}
      />
    </Suspense>
  );
}
```

## 🎵 Sample Data

The component includes default sample songs for testing:

```javascript
const defaultSongs = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    year: 1975,
    genre: "Rock"
  },
  // ... more songs
];
```

## 🔍 Array Method Usage

This project extensively demonstrates JavaScript array methods:

### Filter Examples
```javascript
// Filter by genre
songs.filter(song => song.genre.toLowerCase() === 'rock');

// Filter by year range
songs.filter(song => song.year >= 1970 && song.year < 1980);
```

### Map Examples
```javascript
// Extract unique artists
const artists = [...new Set(songs.map(song => song.artist))];

// Transform song data
const songTitles = songs.map(song => song.title.toUpperCase());
```

### Reduce Examples
```javascript
// Group by decade
const byDecade = songs.reduce((groups, song) => {
  const decade = Math.floor(song.year / 10) * 10;
  groups[decade] = groups[decade] || [];
  groups[decade].push(song);
  return groups;
}, {});
```

## 🐛 Troubleshooting

### Module Federation Issues
- Ensure the app is built and `remoteEntry.js` is accessible
- Check CORS settings if consuming from different domains
- Verify the exposed component path matches the import

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that custom utility classes are defined
- Verify Framer Motion is installed and imported

### Performance Issues
- Use React.memo for expensive components
- Implement virtualization for large song lists
- Optimize animations for better performance

## 📝 License

This project is part of an internship assignment and is for educational purposes.

## 🤝 Contributing

This is an assignment project. For any issues or improvements, please contact the development team.

---

**Standalone Demo:** [Your deployed music-library URL]
**Integration Example:** See main-app repository
**Remote Entry:** `https://your-app.vercel.app/assets/remoteEntry.js`
