import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LayoutNew } from './components/layout/LayoutNew';
import { Landing } from './pages/LandingImproved';
import { Dashboard } from './pages/Dashboard';
import { DocumentViewer } from './pages/DocumentViewer';
import { Profile } from './pages/Profile.jsx';
import { Auth } from './pages/Auth.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

function AppNew() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <LayoutNew>
                <Landing />
              </LayoutNew>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <LayoutNew hideFooter>
                <Auth />
              </LayoutNew>
            } 
          />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutNew isAuthenticated hideFooter>
                  <Dashboard />
                </LayoutNew>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <LayoutNew isAuthenticated hideFooter>
                  <DocumentViewer />
                </LayoutNew>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutNew isAuthenticated>
                  <Profile />
                </LayoutNew>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppNew;
