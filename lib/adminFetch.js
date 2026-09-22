// Client-side helper for admin pages. Cookies are same-origin so the
// session cookie is sent automatically; this just standardizes JSON
// parsing and error handling for the admin dashboard's fetch calls.
export async function adminFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}
