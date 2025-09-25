
import { notFound } from 'next/navigation';
import { projects as allProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import SubmissionDetailsClient from './SubmissionDetailsClient';

export default function CommunitySubmissionDetailsPage({ params }: { params: { id: string } }) {
  // We'll use the rich `projects` data for this detail view
  const project = allProjects.find(p => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }

  return <SubmissionDetailsClient project={project} />;
}
