import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("blog", {
  requireAuthFor: ["PATCH", "DELETE"]
});
