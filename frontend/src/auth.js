let users = ["testuser"];

export const isAuthenticated = () => {
  // Consider user authenticated if a JWT token exists
  return localStorage.getItem("token") !== null;
};

export const login = (username) => {
  // Legacy helper used in some parts of the app; keep behavior
  if (users.includes(username)) {
    localStorage.setItem("user", username);
    return true;
  }
  return false;
};

export const logout = () => {
  // Clear all auth-related storage keys
  localStorage.removeItem("token");
  localStorage.removeItem("role_id");
  localStorage.removeItem("username");
  localStorage.removeItem("user");
};

export const register = (username) => {
  if (!users.includes(username)) {
    users.push(username);
    return true;
  }
  return false;
};

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role_id;
  } catch {
    return null;
  }
}