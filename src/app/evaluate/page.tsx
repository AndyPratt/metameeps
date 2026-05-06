"use client";

import { useState } from "react";
import Link from "next/link";
import { evalRuns, rubrics, characters, goldenSets, apps, workstreams } from "@/lib/mock-data";
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
  ClipboardList,
  Tag,
  ChevronDown,
  ChevronUp,
  Edit3,
  Copy,
} from "lucide-react";

type Tab = "evaluations" | "rubrics";

export default function EvaluatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("evaluations");
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "complete">("all");
  const [expandedRubric, setExpandedRubric] = useState<string | null>(rubrics[0].id);
  const [showNewRubricForm, setShowNewRubricForm] = useState(false);

  const filtered = evalRuns.filter((e) =>
    filter === "all" ? true : e.status === filter
  );

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
    in_progress: { label: "In Progress", icon: Loader2, color: "text-warning", bg: "bg-warning/10" },
    complete: { label: "Complete", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  };

  const tabs = [
    { id: "evaluations" as const, label: "Evaluations" },
    { id: "rubrics" as const, label: `Rubrics (${rubrics.length})` },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Evaluate</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Run evaluations against rubrics and golden sets across all characters.
              </p>
            </div>
            <div>
              {activeTab === "evaluations" && (
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  New Evaluation
                </button>
              )}
              {activeTab === "rubrics" && (
                <button
                  onClick={() => setShowNewRubricForm(!showNewRubricForm)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Rubric
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl">
        {activeTab === "evaluations" && (
          <>
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
          </>
        )}

        {activeTab === "rubrics" && (
          <>
            {showNewRubricForm && (
              <div className="border border-accent/30 rounded-xl p-6 mb-6 bg-accent-light/30">
                <h3 className="text-sm font-semibold text-foreground mb-4">Create New Rubric</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Rubric Name</label>
                    <input
                      type="text"
                      placeholder="e.g., C50 Engagement Quality"
                      className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">App</label>
                    <select className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border">
                      <option value="">Select app...</option>
                      {apps.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Workstream</label>
                    <select className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border">
                      <option value="">Select workstream...</option>
                      {workstreams.map((w) => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Criteria</label>
                  <div className="space-y-2">
                    <CriterionRow />
                    <CriterionRow />
                  </div>
                  <button className="mt-2 text-xs text-accent hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add criterion
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                    Create Rubric
                  </button>
                  <button
                    onClick={() => setShowNewRubricForm(false)}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-6">
              Evaluation criteria templates, organized by project and platform.
            </p>

            <div className="space-y-4">
              {rubrics.map((rubric) => {
                const isExpanded = expandedRubric === rubric.id;
                const totalWeight = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
                return (
                  <div key={rubric.id} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedRubric(isExpanded ? null : rubric.id)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardList className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{rubric.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Tag className="w-3 h-3" /> {rubric.project} &middot; {rubric.platform}
                            </span>
                            <span className="text-xs text-muted-foreground">v{rubric.version}</span>
                            <span className="text-xs text-muted-foreground">{rubric.criteria.length} criteria</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" /> {rubric.createdBy}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border px-5 py-4">
                        <div className="space-y-3 mb-4">
                          {rubric.criteria.map((criterion) => (
                            <div key={criterion.id} className="flex items-start gap-4 bg-muted rounded-lg p-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{criterion.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-foreground">{criterion.weight}%</p>
                                <p className="text-[10px] text-muted-foreground">weight</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            Total weight: <span className={totalWeight === 100 ? "text-success font-medium" : "text-danger font-medium"}>{totalWeight}%</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                              <Copy className="w-3 h-3" /> Duplicate
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
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

function CriterionRow() {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Criterion name"
        className="flex-1 px-3 py-2 bg-white rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border"
      />
      <input
        type="text"
        placeholder="Description"
        className="flex-[2] px-3 py-2 bg-white rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border"
      />
      <input
        type="number"
        placeholder="%"
        className="w-16 px-3 py-2 bg-white rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border"
      />
    </div>
  );
}
