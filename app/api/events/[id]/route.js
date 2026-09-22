import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("events", {
  requireAuthFor: ["PATCH", "DELETE"]
});
