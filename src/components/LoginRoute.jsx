import { Navigate } from "react-router-dom";

const LoginRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // already logged in → dashboard
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default LoginRoute;
