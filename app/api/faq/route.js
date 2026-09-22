import { crudHandlers } from "@/lib/crud";
export const { GET, POST } = crudHandlers("faq", { requireAuthFor: ["POST"] });
