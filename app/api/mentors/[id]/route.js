import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("mentors", {
  requireAuthFor: ["PATCH", "DELETE"]
});
