export const metadata = { title: "Admin — DevSoc" };

// Deliberately minimal: the real chrome (sidebar, auth guard) lives in
// admin/(app)/layout.js so the login page can render without it.
export default function AdminRootLayout({ children }) {
  return <div className="min-h-screen">{children}</div>;
}
