import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '../components/public/WelcomePage';
import { ServicesPackages } from '../components/public/ServicesPackages';
import { ConsultationForm } from '../components/public/ConsultationForm';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { PlannerDashboard } from '../components/planner/PlannerDashboard';
import { ClientDashboard } from '../components/client/ClientDashboard';
import { VendorDashboard } from '../components/vendor/VendorDashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/packages" element={<ServicesPackages />} />
      <Route path="/enquiry" element={<ConsultationForm />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Role-Protected Dashboards (Accessible also via quick-switcher in nav) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PLANNER']}>
            <PlannerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PLANNER', 'ROLE_CLIENT']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_VENDOR']}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

