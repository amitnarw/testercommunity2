"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Expand } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { Project } from "@/lib/types";

export function RejectedProjectSection({
  project,
  setFullscreenImage,
  itemVariants,
}: {
  project: Project;
  setFullscreenImage: (image: string) => void;
  itemVariants: any;
}) {
  if (project.status !== "Rejected" || !project.rejectionReason) {
    return null;
  }

  return (
    <motion.section
      variants={itemVariants}
      className="bg-destructive/10 border-2 border-dashed border-destructive/10 rounded-2xl p-6 relative overflow-hidden mt-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-destructive/5 p-3 sm:bg-destructive/10 sm:p-3 rounded-full text-destructive absolute sm:static top-2 right-0 sm:top-auto sm:right-auto scale-[3] sm:scale-100">
          <AlertTriangle className="w-8 h-8 text-destructive/20 sm:text-destructive" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-destructive dark:text-red-500">
          {project.rejectionReason.title}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <p className="text-destructive/80 dark:text-red-500/80 leading-relaxed flex-1">
          {project.rejectionReason.description}
        </p>
        {project.rejectionReason.imageUrl && (
          <div
            className="relative rounded-lg overflow-hidden group cursor-pointer w-full md:w-1/3"
            onClick={() =>
              setFullscreenImage(project?.rejectionReason?.imageUrl!)
            }
          >
            <SafeImage
              src={project.rejectionReason.imageUrl}
              alt={project.rejectionReason.title}
              width={600}
              height={400}
              className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.rejectionReason.dataAiHint}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Expand className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
