"use client";

import { notFound } from "next/navigation";
import { projects as allProjects } from "@/lib/data";
import ProjectDetailsView from "@/components/dashboard/project-details-view";
import { use } from "react";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = allProjects.find((p) => String(p.id) === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsView project={project} />;
}
