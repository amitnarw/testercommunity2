
import { notFound } from 'next/navigation';
import { projects } from '@/lib/data';
import ProjectDetailsClient from './ProjectDetailsClient';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
