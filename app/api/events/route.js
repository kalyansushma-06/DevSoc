import { crudHandlers } from "@/lib/crud";
// Public GET (browse events), admin-only POST (create new events).
export const { GET, POST } = crudHandlers("events", { requireAuthFor: ["POST"] });
