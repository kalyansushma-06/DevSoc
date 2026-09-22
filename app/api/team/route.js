import { crudHandlers } from "@/lib/crud";
export const { GET, POST } = crudHandlers("team", { requireAuthFor: ["POST"] });
