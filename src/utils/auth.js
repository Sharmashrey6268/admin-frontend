const SESSION_DURATION = 30 * 60 * 1000; // ⏱ 30 minutes

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  // No token or no login time
  if (!token || !loginTime) {
    localStorage.clear();
    return false;
  }

  const isExpired = Date.now() - Number(loginTime) > SESSION_DURATION;

  if (isExpired) {
    localStorage.clear();
    return false;
  }

  return true;
};

export const logout = () => {
  localStorage.clear();
  window.location.replace("/"); // login page
};
