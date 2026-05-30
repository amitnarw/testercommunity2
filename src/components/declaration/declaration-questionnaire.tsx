"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { DeclarationAnswers, CustomQuestion, AdminQuestion } from "@/lib/types";

interface GoogleQuestion {
  id: keyof Omit<DeclarationAnswers, "customQuestions" | "deletedQuestions">;
  section: string;
  question: string;
  help: string;
  type?: "select";
  options?: string[];
}

const GOOGLE_QUESTIONS: GoogleQuestion[] = [
  {
    id: "recruitmentMethod" as const,
    section: "About Your Closed Test",
    question: "1. How did you recruit users for your closed test?",
    help: "Describe the methods and channels used to recruit testers.",
  },
  {
    id: "recruitmentEase" as const,
    section: "About Your Closed Test",
    question: "2. How easy was it to recruit testers for your app?",
    help: "Select how easy or difficult the recruitment process was.",
    type: "select",
    options: ["Very Smooth", "Smooth", "Moderate", "Challenging", "Very Challenging"],
  },
  {
    id: "testerEngagement" as const,
    section: "About Your Closed Test",
    question: "3. Describe the engagement you received from testers during your closed test.",
    help: "Detail how testers used the app, which features they tried, and their level of engagement.",
  },
  {
    id: "feedbackSummary" as const,
    section: "About Your Closed Test",
    question: "4. Provide a summary of the feedback that you received from testers.",
    help: "Summarize the key feedback themes, including bugs, suggestions, and praise.",
  },
  {
    id: "feedbackCollectionMethod" as const,
    section: "About Your Closed Test",
    question: "5. How did you collect the feedback?",
    help: "Describe the tools and methods used to gather tester feedback.",
  },
  {
    id: "intendedAudience" as const,
    section: "About Your App",
    question: "6. Who is the intended audience of your app?",
    help: "Describe your target users in detail.",
  },
  {
    id: "valueDescription" as const,
    section: "About Your App",
    question: "7. Describe how your app provides value to users.",
    help: "Explain the core value proposition and problem your app solves.",
  },
  {
    id: "expectedInstalls" as const,
    section: "About Your App",
    question: "8. How many installs do you expect your app to have in your first year?",
    help: "Select from the available range options.",
    type: "select",
    options: [
      "1,000 – 5,000",
      "5,000 – 10,000",
      "10,000 – 50,000",
      "50,000 – 100,000",
      "100,000 – 500,000",
      "500,000+",
    ],
  },
  {
    id: "changesMade" as const,
    section: "Production Readiness",
    question: "9. What changes did you make to your app based on what you learned during your closed test?",
    help: "Describe any improvements, bug fixes, or feature changes made during or after testing.",
  },
  {
    id: "readinessRationale" as const,
    section: "Production Readiness",
    question: "10. How did you decide that your app is ready for production?",
    help: "Explain the criteria and metrics that indicated production readiness.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

let customQuestionCounter = 0;
function generateCustomId(): string {
  customQuestionCounter += 1;
  return `custom_${customQuestionCounter}_${Date.now()}`;
}

export function DeclarationQuestionnaire({
  answers,
  onChange,
  adminQuestions,
}: {
  answers: DeclarationAnswers;
  onChange: (answers: DeclarationAnswers) => void;
  adminQuestions?: AdminQuestion[];
}) {
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalAnswers(answers);
  }, [answers]);

  const scheduleSave = useCallback(
    (updated: DeclarationAnswers) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        onChange(updated);
      }, 500);
      setDebounceTimer(timer);
    },
    [debounceTimer, onChange],
  );

  const handleChange = (id: keyof DeclarationAnswers, value: string) => {
    const updated = { ...localAnswers, [id]: value };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const handleCustomQuestionChange = (
    customId: string,
    field: "question" | "answer",
    value: string,
  ) => {
    const updatedQuestions = (localAnswers.customQuestions || []).map((cq) =>
      cq.id === customId ? { ...cq, [field]: value } : cq,
    );
    const updated = { ...localAnswers, customQuestions: updatedQuestions };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: generateCustomId(),
      question: "",
      answer: "",
    };
    const updated = {
      ...localAnswers,
      customQuestions: [...(localAnswers.customQuestions || []), newQuestion],
    };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const removeCustomQuestion = (customId: string) => {
    const updatedQuestions = (localAnswers.customQuestions || []).filter(
      (cq) => cq.id !== customId,
    );
    const updated = { ...localAnswers, customQuestions: updatedQuestions };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const handleDeleteQuestion = (id: keyof DeclarationAnswers) => {
    const deleted = localAnswers.deletedQuestions || [];
    if (deleted.includes(id as string)) return;
    const updated = {
      ...localAnswers,
      [id]: "",
      deletedQuestions: [...deleted, id as string],
    };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const handleRestoreQuestion = (id: string) => {
    const deleted = (localAnswers.deletedQuestions || []).filter((d) => d !== id);
    const updated = { ...localAnswers, deletedQuestions: deleted };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const handleRestoreAll = () => {
    const updated = { ...localAnswers, deletedQuestions: [] };
    setLocalAnswers(updated);
    scheduleSave(updated);
  };

  const sections = GOOGLE_QUESTIONS.reduce<
    Record<string, GoogleQuestion[]>
  >((acc, q) => {
    const section = q.section;
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {} as Record<string, GoogleQuestion[]>);

  const showAdminQuestions = adminQuestions && adminQuestions.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">
          {showAdminQuestions ? "Admin Declaration" : "Google Play Declaration"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {showAdminQuestions
            ? "The following questions and answers have been prepared by our team."
            : "Fill out the answers you need to submit to Google Play for production access. Answers are saved automatically as you type."}
        </p>
      </div>

      {/* Admin Questions Section (read-only for PAID apps) */}
      {showAdminQuestions && (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border bg-card overflow-hidden"
        >
          <div className="bg-primary/5 px-6 py-4 border-b">
            <h3 className="font-semibold text-lg">Admin Questions & Answers</h3>
          </div>
          <div className="divide-y">
            {adminQuestions.map((aq, index) => (
              <div key={aq.id} className="p-6 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {aq.question}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                      {aq.answer || "No answer provided."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Google Play Standard Questions (only for FREE apps) */}
      {!showAdminQuestions && Object.entries(sections).map(([sectionName, questions]) => {
        const visible = questions.filter(
          (q) => !(localAnswers.deletedQuestions || []).includes(q.id as string),
        );
        const deleted = questions.filter((q) =>
          (localAnswers.deletedQuestions || []).includes(q.id as string),
        );
        if (visible.length === 0 && deleted.length === 0) return null;
        return (
          <motion.div
            key={sectionName}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border bg-card overflow-hidden"
          >
            <div className="bg-primary/5 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">{sectionName}</h3>
              {deleted.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    deleted.forEach((q) => handleRestoreQuestion(q.id));
                  }}
                  className="text-xs text-muted-foreground hover:text-primary underline"
                >
                  Restore {deleted.length} deleted
                </button>
              )}
            </div>
            <div className="divide-y">
              {visible.map((q) => (
                <div key={q.id} className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <Label className="text-sm font-medium leading-relaxed">
                      {q.question}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                {q.type === "select" ? (
                  <Select
                    value={localAnswers[q.id]}
                    onValueChange={(v) => handleChange(q.id, v)}
                  >
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Textarea
                    value={localAnswers[q.id]}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="min-h-[100px] resize-y text-sm"
                    placeholder="Enter your answer..."
                  />
                )}

                <p className="text-xs text-muted-foreground/70">
                  {q.help}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      );
      })}

      {/* Custom Questions (same for both PAID and FREE) */}
      {(localAnswers.customQuestions || []).length > 0 && (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl border bg-card overflow-hidden"
        >
          <div className="bg-primary/5 px-6 py-4 border-b">
            <h3 className="font-semibold text-lg">
              {showAdminQuestions ? "Your Custom Questions" : "Custom Questions"}
            </h3>
          </div>
          <div className="divide-y">
            {(localAnswers.customQuestions || []).map((cq) => (
              <div key={cq.id} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs font-medium">Custom Question</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomQuestion(cq.id)}
                    className="text-destructive hover:text-destructive h-8 px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={cq.question}
                  onChange={(e) =>
                    handleCustomQuestionChange(cq.id, "question", e.target.value)
                  }
                  placeholder="Enter your question..."
                  className="text-sm"
                />
                <Textarea
                  value={cq.answer}
                  onChange={(e) =>
                    handleCustomQuestionChange(cq.id, "answer", e.target.value)
                  }
                  className="min-h-[80px] resize-y text-sm"
                  placeholder="Enter your answer..."
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={addCustomQuestion}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      <div className="rounded-2xl border bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground">
          {showAdminQuestions
            ? "Your custom questions are saved automatically. They will be included in the PDF report alongside the admin-provided answers."
            : "Your answers are saved automatically as you type. You can add custom questions beyond the standard Google Play ones using the &quot;Add Question&quot; button above."}
        </p>
      </div>
    </div>
  );
}
