import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("contact", {
  requireAuthFor: ["GET", "PATCH", "DELETE"]
});
