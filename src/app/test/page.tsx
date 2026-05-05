"use client";

import Link from "next/link";
import { dialogueTests, callTestSessions, characters } from "@/lib/mock-data";
import {
  MessageSquare,
  Phone,
  Clock,
  User,
  Play,
  ArrowRight,
  FlaskConical,
} from "lucide-react";

export default function TestPage() {
  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Test character dialogue and live call experiences across all characters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/test/dialogue" className="flex items-center gap-1.5 px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">
            <MessageSquare className="w-4 h-4" />
            New Dialogue Test
          </Link>
          <Link href="/test/call" className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            <Phone className="w-4 h-4" />
            New Call Test
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatCard icon={MessageSquare} label="Dialogue Tests" value={dialogueTests.length} />
        <StatCard icon={Phone} label="Call Sessions" value={callTestSessions.length} />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Dialogue Tests</h2>
          <Link href="/test/dialogue" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {dialogueTests.map((test) => {
            const character = characters.find((c) => c.id === test.characterId);
            return (
              <div key={test.id} className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">
                      {character?.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{character?.name}</p>
                      <p className="text-xs text-muted-foreground">Persona: {test.personaName} &middot; {test.turns} turns</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground" title="Play back dialogue">
                      <Play className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground">{new Date(test.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  {test.transcript.slice(0, 2).map((turn, i) => (
                    <div key={i} className="flex gap-2">
                      <span className={`text-xs font-medium shrink-0 w-16 ${turn.speaker === "character" ? "text-accent" : "text-muted-foreground"}`}>
                        {turn.speaker === "character" ? character?.name : "User"}
                      </span>
                      <p className="text-xs text-foreground line-clamp-1">{turn.text}</p>
                    </div>
                  ))}
                  {test.transcript.length > 2 && (
                    <p className="text-xs text-muted-foreground">+{test.transcript.length - 2} more turns</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Call Sessions</h2>
          <Link href="/test/call" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {callTestSessions.map((session) => {
            const character = characters.find((c) => c.id === session.characterId);
            return (
              <div key={session.id} className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">
                      {character?.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{character?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Model: {session.model} &middot; {Math.floor(session.duration / 60)}:{String(session.duration % 60).padStart(2, "0")} &middot; {session.settings.uiOverlay}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
                {session.llmAnalysis && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">LLM Analysis</p>
                    <p className="text-xs text-foreground line-clamp-2">{session.llmAnalysis}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
