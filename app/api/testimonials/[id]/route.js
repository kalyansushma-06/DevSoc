import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("testimonials", {
  requireAuthFor: ["PATCH", "DELETE"]
});
