import { crudHandlers } from "@/lib/crud";
// Anyone can submit a testimonial (defaults to unapproved); admin approves.
export const { GET, POST } = crudHandlers("testimonials");
