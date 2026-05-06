"use client";

import { useState } from "react";
import Link from "next/link";
import { dialogueTests, callTestSessions, characters, userPersonas } from "@/lib/mock-data";
import {
  MessageSquare,
  Phone,
  Play,
  Plus,
  UserCircle,
  User,
  Edit3,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type Tab = "overview" | "personas";

interface PersonaForm {
  name: string;
  description: string;
  behavior: string;
}

const emptyForm: PersonaForm = { name: "", description: "", behavior: "" };

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showNewPersonaForm, setShowNewPersonaForm] = useState(false);
  const [newForm, setNewForm] = useState<PersonaForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PersonaForm>(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const startEditing = (persona: typeof userPersonas[number]) => {
    setEditingId(persona.id);
    setEditForm({ name: persona.name, description: persona.description, behavior: persona.behavior });
    setExpandedId(persona.id);
  };

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "personas" as const, label: `Personas (${userPersonas.length})` },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 md:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Test</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Test character dialogue and live call experiences across all characters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "overview" && (
                <>
                  <Link href="/test/dialogue" className="flex items-center gap-1.5 px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    New Dialogue Test
                  </Link>
                  <Link href="/test/call" className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                    <Phone className="w-4 h-4" />
                    New Call Test
                  </Link>
                </>
              )}
              {activeTab === "personas" && (
                <button
                  onClick={() => setShowNewPersonaForm(!showNewPersonaForm)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Persona
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

      <div className="p-4 sm:p-6 md:p-8 max-w-7xl">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <StatCard icon={Phone} label="Call Sessions" value={callTestSessions.length} />
              <StatCard icon={MessageSquare} label="Dialogue Tests" value={dialogueTests.length} />
            </div>

            <section className="mb-10">
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

          </>
        )}

        {activeTab === "personas" && (
          <>
            {showNewPersonaForm && (
              <div className="border border-accent/30 rounded-xl p-6 mb-6 bg-accent-light/20">
                <h3 className="text-sm font-semibold text-foreground mb-4">Create New Persona</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Persona Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Enthusiastic Explorer, Few-Word Responder"
                      value={newForm.name}
                      onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                    <textarea
                      placeholder="Describe this persona's personality and interaction style..."
                      value={newForm.description}
                      onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Behavior Pattern</label>
                    <textarea
                      placeholder="How does this persona behave in conversation? e.g., 'Long responses, multiple questions per turn'"
                      value={newForm.behavior}
                      onChange={(e) => setNewForm((f) => ({ ...f, behavior: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => { setShowNewPersonaForm(false); setNewForm(emptyForm); }}
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                  >
                    Create Persona
                  </button>
                  <button
                    onClick={() => { setShowNewPersonaForm(false); setNewForm(emptyForm); }}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-6">
              Reusable user personas for dialogue testing. Shared across all characters and the team.
            </p>

            <div className="space-y-3">
              {userPersonas.map((persona) => {
                const isExpanded = expandedId === persona.id;
                const isEditing = editingId === persona.id;
                return (
                  <div key={persona.id} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded && !isEditing ? null : persona.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{persona.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{persona.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {persona.createdBy}
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && !isEditing && (
                      <div className="px-5 pb-5 border-t border-border pt-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Description</p>
                            <p className="text-sm text-foreground leading-relaxed">{persona.description}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Behavior Pattern</p>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-foreground leading-relaxed">{persona.behavior}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditing(persona); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <Link
                            href="/test/dialogue"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" /> Use in dialogue test
                          </Link>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-danger hover:bg-muted rounded-lg transition-colors ml-auto">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {isExpanded && isEditing && (
                      <div className="px-5 pb-5 border-t border-border pt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Persona Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                              className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                              rows={2}
                              className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Behavior Pattern</label>
                            <textarea
                              value={editForm.behavior}
                              onChange={(e) => setEditForm((f) => ({ ...f, behavior: e.target.value }))}
                              rows={3}
                              className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => { setEditingId(null); setEditForm(emptyForm); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditForm(emptyForm); }}
                            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
                          >
                            Cancel
                          </button>
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
