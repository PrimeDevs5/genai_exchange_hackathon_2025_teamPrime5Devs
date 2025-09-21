import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/LandingImproved';
import { Dashboard } from './pages/Dashboard';
import { DocumentViewer } from './pages/DocumentViewer';
import { Layout } from './components/layout/Layout';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { DocumentProcessingProvider } from './contexts/DocumentProcessingContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <DocumentProcessingProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout>
                      <Landing />
                    </Layout>} />
                <Route path="/auth/*" element={<Auth />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Layout>
                        <Dashboard />
                      </Layout>} />
                  <Route path="/document/:id" element={<Layout>
                        <DocumentViewer />
                      </Layout>} />
                  <Route path="/profile" element={<Layout>
                        <Profile />
                      </Layout>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DocumentProcessingProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}