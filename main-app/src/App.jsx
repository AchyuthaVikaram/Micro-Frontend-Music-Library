import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SongsProvider } from './context/SongsContext';
import { ToastProvider } from './context/ToastContext';
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
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile overlay

  return (
    <div className="relative flex min-h-screen bg-gray-900">
      {/* Desktop sidebar - fixed 20% width */}
      <div className="hidden md:block w-1/5 min-w-[240px]">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div className="relative z-40 w-64 max-w-[80%] h-full bg-gray-800/95 border-r border-gray-700">
            <Sidebar isOpen={true} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content - 80% on desktop */}
      <div className="flex-1 md:w-4/5 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
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
        <ToastProvider>
          <SongsProvider>
            <AppContent />
          </SongsProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
