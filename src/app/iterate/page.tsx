"use client";

import { useState } from "react";
import Link from "next/link";
import { characters, evalRuns, rubrics } from "@/lib/mock-data";
import {
  RefreshCw,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCompare,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function IteratePage() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0].id);
  const [compareMode, setCompareMode] = useState(false);

  const character = characters.find((c) => c.id === selectedCharacter);
  const charEvals = evalRuns.filter((e) => e.characterId === selectedCharacter && e.status === "complete");

  const versionScores = character?.versions.map((v) => ({
    version: v.version,
    summary: v.summary,
    date: v.createdAt,
    overallScore: v.version === 3 ? 85 : v.version === 2 ? 78 : 72,
    passRate: v.version === 3 ? 92 : v.version === 2 ? 85 : 70,
  })) || [];

  const failurePatterns = [
    { pattern: "Character breaks persona when asked about personal life", frequency: 8, severity: "high" as const, affectedVersions: [1, 2] },
    { pattern: "Responses exceed 3-sentence limit in C50 config", frequency: 5, severity: "medium" as const, affectedVersions: [2, 3] },
    { pattern: "Tone shifts to clinical when discussing stress", frequency: 3, severity: "low" as const, affectedVersions: [3] },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Iterate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track improvements, compare versions, and refine characters based on eval data.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">
          <Download className="w-4 h-4" />
          Pull Production Prompt
        </button>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Character</label>
        <select
          value={selectedCharacter}
          onChange={(e) => setSelectedCharacter(e.target.value)}
          className="w-64 px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
        >
          {characters.map((c) => (
            <option key={c.id} value={c.id}>{c.name} (v{c.version})</option>
          ))}
        </select>
      </div>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-foreground mb-4">Version Performance</h2>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Version</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Changes</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Overall Score</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Pass Rate</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Trend</th>
                <th className="px-5 py-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {versionScores.slice().reverse().map((vs, i) => {
                const prevScore = versionScores[versionScores.indexOf(vs) - 1]?.overallScore;
                const trend = prevScore ? vs.overallScore - prevScore : 0;
                return (
                  <tr key={vs.version} className="border-t border-border">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                        i === 0 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        v{vs.version}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{vs.summary}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-foreground">{vs.overallScore}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div
                            className={`h-2 rounded-full ${vs.passRate >= 90 ? "bg-success" : vs.passRate >= 80 ? "bg-warning" : "bg-danger"}`}
                            style={{ width: `${vs.passRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{vs.passRate}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {trend > 0 ? (
                        <span className="flex items-center gap-1 text-success text-xs font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />+{trend}
                        </span>
                      ) : trend < 0 ? (
                        <span className="flex items-center gap-1 text-danger text-xs font-medium">
                          <TrendingDown className="w-3.5 h-3.5" />{trend}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Minus className="w-3.5 h-3.5" />baseline
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{new Date(vs.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Side-by-Side Comparison</h2>
        </div>
        <div className="border border-border rounded-xl p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Version A</label>
              <select className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                {character?.versions.map((v) => (
                  <option key={v.version} value={v.version}>v{v.version} — {v.summary}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Version B</label>
              <select className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                {character?.versions.slice().reverse().map((v) => (
                  <option key={v.version} value={v.version}>v{v.version} — {v.summary}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">v1 Scores</span>
                <span className="text-sm font-semibold text-foreground">72/100</span>
              </div>
              <div className="space-y-2">
                {["Persona Consistency", "Engagement", "Appropriateness", "Goal Alignment", "Flow"].map((c, i) => (
                  <div key={c} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c}</span>
                    <span className="text-xs font-medium text-foreground">{[75, 68, 70, 72, 65][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-accent-light rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-accent">v3 Scores</span>
                <span className="text-sm font-semibold text-accent">85/100</span>
              </div>
              <div className="space-y-2">
                {["Persona Consistency", "Engagement", "Appropriateness", "Goal Alignment", "Flow"].map((c, i) => {
                  const v3 = [92, 85, 78, 88, 82][i];
                  const v1 = [75, 68, 70, 72, 65][i];
                  const diff = v3 - v1;
                  return (
                    <div key={c} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{c}</span>
                      <span className="text-xs font-medium text-accent">
                        {v3} <span className="text-success">(+{diff})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors flex items-center justify-center gap-2">
            <GitCompare className="w-4 h-4" />
            Compare Transcripts
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recurring Failure Patterns</h2>
          <span className="text-xs text-muted-foreground">{failurePatterns.length} patterns detected</span>
        </div>
        <div className="space-y-3">
          {failurePatterns.map((fp, i) => (
            <div key={i} className="border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                    fp.severity === "high" ? "text-danger" : fp.severity === "medium" ? "text-warning" : "text-muted-foreground"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{fp.pattern}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fp.frequency} occurrences &middot; Affected versions: {fp.affectedVersions.map((v) => `v${v}`).join(", ")}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                  fp.severity === "high" ? "bg-danger/10 text-danger" :
                  fp.severity === "medium" ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {fp.severity}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-xs text-foreground hover:bg-border transition-colors">
                  <Sparkles className="w-3 h-3" />
                  View Suggested Fix
                </button>
                <Link href="/create" className="flex items-center gap-1 px-3 py-1.5 text-xs text-accent hover:underline">
                  Edit Prompt <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
