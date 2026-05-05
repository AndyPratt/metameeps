"use client";

import { useState } from "react";
import Link from "next/link";
import { evalRuns, rubrics, characters, goldenSets } from "@/lib/mock-data";
import {
  BarChart3,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  FileText,
} from "lucide-react";

export default function EvaluatePage() {
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "complete">("all");

  const filtered = evalRuns.filter((e) =>
    filter === "all" ? true : e.status === filter
  );

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
    in_progress: { label: "In Progress", icon: Loader2, color: "text-warning", bg: "bg-warning/10" },
    complete: { label: "Complete", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Evaluate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Run evaluations against rubrics and golden sets across all characters.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Evaluation
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Evals" value={evalRuns.length} />
        <StatCard label="Pending" value={evalRuns.filter((e) => e.status === "pending").length} />
        <StatCard label="In Progress" value={evalRuns.filter((e) => e.status === "in_progress").length} />
        <StatCard label="Complete" value={evalRuns.filter((e) => e.status === "complete").length} />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(["all", "pending", "in_progress", "complete"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              filter === f ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((evalRun) => {
          const status = statusConfig[evalRun.status];
          const StatusIcon = status.icon;
          const rubric = rubrics.find((r) => r.id === evalRun.rubricId);

          return (
            <div key={evalRun.id} className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">
                    {evalRun.characterName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{evalRun.characterName} v{evalRun.version}</p>
                    <p className="text-xs text-muted-foreground">{evalRun.rubricName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {evalRun.assignedReviewer && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {evalRun.assignedReviewer}
                    </span>
                  )}
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              </div>

              {evalRun.status === "complete" && rubric && (
                <div className="bg-muted rounded-xl p-4">
                  <div className="grid grid-cols-5 gap-3">
                    {rubric.criteria.map((criterion) => {
                      const llm = evalRun.llmScores[criterion.id];
                      const human = evalRun.humanScores[criterion.id];
                      const diff = human != null && llm != null ? human - llm : null;

                      return (
                        <div key={criterion.id} className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">{criterion.name}</p>
                          <div className="flex items-center justify-center gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">LLM</p>
                              <p className="text-lg font-semibold text-foreground">{llm ?? "—"}</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Human</p>
                              <p className="text-lg font-semibold text-foreground">{human ?? "—"}</p>
                            </div>
                          </div>
                          {diff != null && (
                            <p className={`text-[10px] mt-1 ${Math.abs(diff) > 5 ? "text-warning font-medium" : "text-muted-foreground"}`}>
                              {diff > 0 ? "+" : ""}{diff}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {evalRun.status === "in_progress" && rubric && (
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <p className="text-xs text-foreground font-medium">LLM scoring complete — awaiting human review</p>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {rubric.criteria.map((criterion) => {
                      const llm = evalRun.llmScores[criterion.id];
                      return (
                        <div key={criterion.id} className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">{criterion.name}</p>
                          <div className="flex items-center justify-center gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">LLM</p>
                              <p className="text-lg font-semibold text-foreground">{llm ?? "—"}</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Human</p>
                              <p className="text-lg font-semibold text-muted-foreground">—</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {evalRun.status === "pending" && (
                <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Evaluation not yet started</p>
                  </div>
                  <button className="text-xs text-accent font-medium hover:underline">Run Now</button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(evalRun.createdAt).toLocaleDateString()}
                  {evalRun.completedAt && ` · Completed ${new Date(evalRun.completedAt).toLocaleDateString()}`}
                </span>
                {evalRun.status === "complete" && (
                  <Link href="/iterate" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
                    View in Iterate <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Golden Sets</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Curated benchmark conversations for evaluation</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Golden Set
          </button>
        </div>
        <div className="space-y-3">
          {goldenSets.map((gs) => (
            <div key={gs.id} className="border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{gs.name}</p>
                    <p className="text-xs text-muted-foreground">{gs.project} · {gs.conversations.length} conversations · by {gs.createdBy}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(gs.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded-xl p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
