export const dynamic = "force-dynamic";

import { readCollection } from "@/lib/db";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import ProjectSubmitForm from "@/components/ProjectSubmitForm";

export const metadata = { title: "Projects — DevSoc" };

export default async function ProjectsPage() {
  const projects = (await readCollection("projects")).filter((p) => p.status === "approved");

  return (
    <div className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Member showcase</span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Projects</h1>
          <p className="mt-4 max-w-xl text-white/60">
            Filter by domain or tech stack, upvote what you like, and drop a comment.
          </p>
        </div>
        <ProjectSubmitForm />
      </div>

      <div className="mt-10">
        <ProjectsExplorer projects={projects} />
      </div>
    </div>
  );
}
