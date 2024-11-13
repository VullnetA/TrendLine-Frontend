export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, options);
  return response;
}
