import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // 1. Wait for Supabase to finish checking the vault
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  // 2. If Supabase says there is no user, kick them to the login page!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in, let them through to the page!
  return <>{children}</>;
};

export default ProtectedRoute;