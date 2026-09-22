import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { readCollection, writeCollection } from "@/lib/db";

export async function POST(request, { params }) {
  const { name, text } = await request.json();
  if (!name || !text) {
    return NextResponse.json({ error: "Name and comment text are required." }, { status: 400 });
  }

  const projects = readCollection("projects");
  const idx = projects.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const comment = { id: nanoid(8), name, text, createdAt: new Date().toISOString() };
  projects[idx].comments = projects[idx].comments || [];
  projects[idx].comments.push(comment);
  writeCollection("projects", projects);

  return NextResponse.json({ comment }, { status: 201 });
}
