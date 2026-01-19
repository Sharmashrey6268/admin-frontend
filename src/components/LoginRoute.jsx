import { Navigate } from "react-router-dom";

const SESSION_DURATION = 30 * 60 * 1000;

const LoginRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  if (!token || !loginTime) {
    return children;
  }

  const isExpired = Date.now() - Number(loginTime) > SESSION_DURATION;

  if (isExpired) {
    localStorage.clear();
    return children;
  }

  return <Navigate to="/admin/dashboard" replace />;
};

export default LoginRoute;
