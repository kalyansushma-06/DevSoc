import { crudHandlers } from "@/lib/crud";
// Anyone can submit a project (status defaults to "pending" from the client
// form); admin approves via PATCH before it shows on the public showcase.
export const { GET, POST } = crudHandlers("projects");
