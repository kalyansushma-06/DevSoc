import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("teamup", {
  requireAuthFor: ["PATCH", "DELETE"]
});
