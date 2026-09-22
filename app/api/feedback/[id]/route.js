import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("feedback", {
  requireAuthFor: ["GET", "PATCH", "DELETE"]
});
