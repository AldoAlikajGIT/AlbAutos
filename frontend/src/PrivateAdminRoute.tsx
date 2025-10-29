import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function PrivateAdminRoute({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthorized(false);
      return;
    }

    let cancelled = false;

    axios
      .get("http://localhost:8080/api/users/role-check", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;
        // Backend returns role names like "ROLE_ADMIN"
        setAuthorized(res.data.role === "ROLE_ADMIN");
      })
      .catch(() => {
        if (cancelled) return;
        setAuthorized(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Avoid flashing protected content while checking
  if (authorized === null) return null;

  if (!authorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
