import { crudHandlers } from "@/lib/crud";
// Public POST (the site-wide feedback box), admin-only reading.
export const { GET, POST } = crudHandlers("feedback", { requireAuthFor: ["GET"] });
