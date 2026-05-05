"use client";

import { useState } from "react";
import { rubrics, products, platforms } from "@/lib/mock-data";
import {
  Plus,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  User,
  Edit3,
  Trash2,
  Copy,
} from "lucide-react";

export default function RubricsPage() {
  const [expandedRubric, setExpandedRubric] = useState<string | null>(rubrics[0].id);
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Rubrics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluation criteria templates, organized by project and platform.
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Rubric
        </button>
      </div>

      {showNewForm && (
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
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Project</label>
              <select className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border">
                <option value="">Select project...</option>
                {products.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Platform</label>
              <select className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 border border-border">
                <option value="">Select platform...</option>
                {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
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
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
