import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readCollection } from "@/lib/db";

// Admin dashboard summary numbers, including pending-approval counts.
export async function GET() {
  if (!getSession()) return NextResponse.json({ error: "Admin login required." }, { status: 401 });

  const events = await readCollection("events");
  const projects = await readCollection("projects");
  const members = await readCollection("members");
  const mentors = await readCollection("mentors");
  const testimonials = await readCollection("testimonials");
  const certificates = await readCollection("certificates");
  const teamup = await readCollection("teamup");
  const feedback = await readCollection("feedback");
  const contact = await readCollection("contact");
  const newsletter = await readCollection("newsletter");
  const blog = await readCollection("blog");
  return NextResponse.json({
    totals: {
      events: events.length,
      projects: projects.length,
      members: members.length,
      mentors: mentors.length,
      certificates: certificates.length,
      newsletter: newsletter.length,
      blogPosts: blog.length,
      teamup: teamup.length
    },
    pending: {
      members: members.filter((m) => m.status === "pending").length,
      mentors: mentors.filter((m) => m.status === "pending").length,
      projects: projects.filter((p) => p.status === "pending").length,
      testimonials: testimonials.filter((t) => !t.approved).length
    },
    inbox: {
      feedback: feedback.length,
      contact: contact.length
    }
  });
}
