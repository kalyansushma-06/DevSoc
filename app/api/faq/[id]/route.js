import { itemHandlers } from "@/lib/crud";
export const { GET, PATCH, DELETE } = itemHandlers("faq", {
  requireAuthFor: ["PATCH", "DELETE"]
});
