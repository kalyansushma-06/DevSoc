import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("projects", {
  requireAuthFor: ["PATCH", "DELETE"]
});
