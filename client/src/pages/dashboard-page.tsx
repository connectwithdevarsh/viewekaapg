import { useState } from "react";
import AdminLogin from "@/components/admin/admin-login";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
