import { crudHandlers } from "@/lib/crud";
// Listing + issuing certificates is admin-only. Public verification lives at
// /api/certificates/verify so the full registry isn't scrapeable.
export const { GET, POST } = crudHandlers("certificates", {
  requireAuthFor: ["GET", "POST"]
});
