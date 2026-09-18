import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomeProvider } from './context/HomeContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Rooms } from './pages/Rooms';
import { Devices } from './pages/Devices';
import { Schedules } from './pages/Schedules';
import { Energy } from './pages/Energy';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HomeProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="devices" element={<Devices />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="energy" element={<Energy />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HomeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
