import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("certificates", {
  requireAuthFor: ["GET", "PATCH", "DELETE"]
});
