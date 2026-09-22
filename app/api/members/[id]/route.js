import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("members", {
  requireAuthFor: ["GET", "PATCH", "DELETE"]
});
