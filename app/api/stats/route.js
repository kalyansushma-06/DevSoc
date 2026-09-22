import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readCollection } from "@/lib/db";

// Admin dashboard summary numbers, including pending-approval counts.
export async function GET() {
  if (!getSession()) return NextResponse.json({ error: "Admin login required." }, { status: 401 });

  const events = readCollection("events");
  const projects = readCollection("projects");
  const members = readCollection("members");
  const mentors = readCollection("mentors");
  const testimonials = readCollection("testimonials");
  const certificates = readCollection("certificates");
  const teamup = readCollection("teamup");
  const feedback = readCollection("feedback");
  const contact = readCollection("contact");
  const newsletter = readCollection("newsletter");
  const blog = readCollection("blog");

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
