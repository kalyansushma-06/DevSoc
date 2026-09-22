import { crudHandlers } from "@/lib/crud";
// Mentor applications come in public (status: "pending"); admin approves.
export const { GET, POST } = crudHandlers("mentors");
