import { crudHandlers } from "@/lib/crud";
// Recruitment applications: public POST, admin-only listing + review.
export const { GET, POST } = crudHandlers("members", { requireAuthFor: ["GET"] });
