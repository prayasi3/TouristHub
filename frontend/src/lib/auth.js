export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user, token = "") {
  localStorage.setItem("user", JSON.stringify(user));
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
  window.dispatchEvent(new Event("storage"));
}

export function clearSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage"));
}

export function isAuthenticated() {
  return Boolean(getStoredUser());
}

export function isAdmin() {
  return getStoredUser()?.role === "ADMIN";
}
