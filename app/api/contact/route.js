import { crudHandlers } from "@/lib/crud";
export const { GET, POST } = crudHandlers("contact", { requireAuthFor: ["GET"] });
