import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireRoleProps {
  allow: string[]; // ["Admin"], ["User"], ["Admin", "User"]
  children: React.ReactNode;
}

const RequireRole = ({ allow, children }: RequireRoleProps) => {
  const location = useLocation();

  const userRaw = sessionStorage.getItem("user");
  const role = userRaw ? JSON.parse(userRaw)?.role : null;

  // chưa đăng nhập
  if (!allow.includes(role)) return <Navigate to="/" replace />;

  // sai role
  if (!allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
