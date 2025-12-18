import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) {
        console.log("PrivateRoute: Loading...");
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!user) {
        console.log("PrivateRoute: No user, redirecting to login");
        return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log(`PrivateRoute: Role ${user.role} not allowed in ${allowedRoles}`);
        return <Navigate to="/admin/dashboard" replace />; // Or unauthorized page
    }

    console.log("PrivateRoute: Access granted");

    return <Outlet />;
}
