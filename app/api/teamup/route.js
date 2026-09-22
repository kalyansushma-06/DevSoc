import { crudHandlers } from "@/lib/crud";
// Anyone can post a "need a teammate" listing, no approval needed.
export const { GET, POST } = crudHandlers("teamup");
