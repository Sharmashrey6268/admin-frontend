import { Navigate, useLocation } from "react-router-dom";

const SESSION_DURATION = 30 * 60 * 1000; // ⏱ 30 minutes

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");
  const location = useLocation();

  if (!token || !loginTime) {
    localStorage.clear();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const isExpired = Date.now() - Number(loginTime) > SESSION_DURATION;

  if (isExpired) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
