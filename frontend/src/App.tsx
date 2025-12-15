import { useAuthStore } from './store/authStore';
import { AdminLogin } from './components/auth/AdminLogin';
import { UserAuth } from './components/auth/UserAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { PublicLanding } from './components/public/PublicLanding';

export default function App() {
  const { currentUser, authView } = useAuthStore();

  // Show admin login
  if (authView === 'admin-login') {
    return <AdminLogin />;
  }

  // Show user login/register
  if (authView === 'user-auth') {
    return <UserAuth />;
  }

  // If logged in as admin, show admin dashboard
  if (currentUser?.role === 'admin') {
    return <AdminDashboard />;
  }

  // If logged in as user, show user dashboard
  if (currentUser?.role === 'user') {
    return <UserDashboard />;
  }

  // Default: show public landing page
  return <PublicLanding />;
}
