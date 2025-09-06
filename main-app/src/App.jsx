import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SongsProvider } from './context/SongsContext';
import Protected from './components/Protected';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { useAuth } from './context/AuthContext';

// Layout component for authenticated pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// App content component (needs to be inside AuthProvider)
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <Protected>
            <AppLayout>
              <Home />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <AppLayout>
              <Settings />
            </AppLayout>
          </Protected>
        }
      />
      
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SongsProvider>
          <AppContent />
        </SongsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
