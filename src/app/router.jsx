import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/home', element: <DashboardPage /> }],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
