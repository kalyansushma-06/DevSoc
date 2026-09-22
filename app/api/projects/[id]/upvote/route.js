import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

// Toggle an upvote for a project. Body: { voterId } - a random id the client
// generates once and stores in localStorage, so the same browser can't
// upvote twice but no login is required.
export async function POST(request, { params }) {
  const { voterId } = await request.json();
  if (!voterId) return NextResponse.json({ error: "Missing voterId." }, { status: 400 });

  const projects = readCollection("projects");
  const idx = projects.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const project = projects[idx];
  project.upvotedBy = project.upvotedBy || [];
  const already = project.upvotedBy.includes(voterId);

  if (already) {
    project.upvotedBy = project.upvotedBy.filter((v) => v !== voterId);
    project.upvotes = Math.max(0, (project.upvotes || 0) - 1);
  } else {
    project.upvotedBy.push(voterId);
    project.upvotes = (project.upvotes || 0) + 1;
  }

  projects[idx] = project;
  writeCollection("projects", projects);

  return NextResponse.json({ upvotes: project.upvotes, upvoted: !already });
}
