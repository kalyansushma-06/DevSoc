import { crudHandlers } from "@/lib/crud";
export const { GET, POST } = crudHandlers("blog", { requireAuthFor: ["POST"] });
