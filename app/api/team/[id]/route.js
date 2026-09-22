import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("team", {
  requireAuthFor: ["PATCH", "DELETE"]
});
