"use client";

import { useState } from "react";
import Link from "next/link";
import { dialogueTests, callTestSessions, characters, userPersonas, voices, models, uiOverlays } from "@/lib/mock-data";
import {
  MessageSquare,
  Phone,
  PhoneOff,
  Play,
  Plus,
  UserCircle,
  User,
  Edit3,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
  Mic,
  MicOff,
  Captions,
  Timer,
  Pause,
  Volume2,
  Flag,
} from "lucide-react";

type Tab = "call" | "dialogue" | "archive" | "personas";

interface PersonaForm {
  name: string;
  description: string;
  behavior: string;
}

const emptyForm: PersonaForm = { name: "", description: "", behavior: "" };

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<Tab>("call");
  const [showNewPersonaForm, setShowNewPersonaForm] = useState(false);
  const [newForm, setNewForm] = useState<PersonaForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PersonaForm>(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Call test state
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0].id);
  const [callState, setCallState] = useState<"settings" | "ringing" | "active" | "ended">("settings");
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [callSettings, setCallSettings] = useState({
    model: "Pumpkin",
    characterCanEndCall: false,
    userInitiatesFirst: false,
    characterCanSearch: false,
    uiOverlay: "vibe-call",
    showTimer: true,
    showCaptions: false,
  });

  // Dialogue test state
  const [dialogueCharacter, setDialogueCharacter] = useState(characters[0].id);
  const [selectedPersona, setSelectedPersona] = useState(userPersonas[0].id);
  const [turns, setTurns] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);

  const character = characters.find((c) => c.id === selectedCharacter);
  const dialogueChar = characters.find((c) => c.id === dialogueCharacter);
  const sampleTest = dialogueTests[0];

  const startEditing = (persona: typeof userPersonas[number]) => {
    setEditingId(persona.id);
    setEditForm({ name: persona.name, description: persona.description, behavior: persona.behavior });
    setExpandedId(persona.id);
  };

  const startCall = () => {
    setCallState("ringing");
    setTimeout(() => setCallState("active"), 2000);
  };

  const endCall = () => setCallState("ended");

  const tabs = [
    { id: "call" as const, label: "Call Test" },
    { id: "dialogue" as const, label: "Dialogue Test" },
    { id: "archive" as const, label: "Session Archive" },
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
                Test character dialogue and live call experiences.
              </p>
            </div>
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
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Call Test Tab */}
      {activeTab === "call" && (
        <div className="flex flex-col md:flex-row">
          {callState === "settings" && (
            <>
              <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-border p-4 sm:p-6 space-y-5 md:sticky md:top-[130px] md:self-start md:max-h-[calc(100vh-130px)] md:overflow-y-auto">
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-4">Session Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Character</label>
                      <select value={selectedCharacter} onChange={(e) => setSelectedCharacter(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                        {characters.map((c) => <option key={c.id} value={c.id}>{c.name} (v{c.version})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Appearance</label>
                      <select className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                        <option>Default</option>
                        <option>Outdoor Adventure</option>
                      </select>
                    </div>
                    {character?.configurations[0]?.platform === "1P Characters" && character.scenes.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Scene</label>
                        <select className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                          {character.scenes.map((s) => <option key={s.id} value={s.id}>{s.title || "Untitled Scene"}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Model</label>
                      <select value={callSettings.model} onChange={(e) => setCallSettings((s) => ({ ...s, model: e.target.value }))} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                        {models.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">UI Overlay</label>
                      <select value={callSettings.uiOverlay} onChange={(e) => setCallSettings((s) => ({ ...s, uiOverlay: e.target.value }))} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                        {uiOverlays.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Conversation Settings</h3>
                  <div className="space-y-3">
                    <ToggleSetting label="Character can end call" description="Allow the character to terminate the conversation" checked={callSettings.characterCanEndCall} onChange={(v) => setCallSettings((s) => ({ ...s, characterCanEndCall: v }))} />
                    <ToggleSetting label="User initiates first turn" description="User speaks first instead of character" checked={callSettings.userInitiatesFirst} onChange={(v) => setCallSettings((s) => ({ ...s, userInitiatesFirst: v }))} />
                    <ToggleSetting label="Character can access search" description="Allow the character to search for information" checked={callSettings.characterCanSearch} onChange={(v) => setCallSettings((s) => ({ ...s, characterCanSearch: v }))} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">UI Affordances</h3>
                  <div className="space-y-3">
                    <ToggleSetting label="Show timer" description="Display call duration timer" checked={callSettings.showTimer} onChange={(v) => setCallSettings((s) => ({ ...s, showTimer: v }))} />
                    <ToggleSetting label="Show captions" description="Enable live captions during the call" checked={callSettings.showCaptions} onChange={(v) => setCallSettings((s) => ({ ...s, showCaptions: v }))} />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-130px)]">
                <div className="w-[375px]">
                  <div className="bg-foreground rounded-[40px] p-2 shadow-2xl">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[32px] overflow-hidden aspect-[9/16] flex flex-col items-center justify-center relative">
                      <div className="absolute top-6 left-0 right-0 text-center">
                        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Ready to call</span>
                      </div>
                      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
                        <span className="text-4xl font-semibold text-white">{character?.name[0]}</span>
                      </div>
                      <p className="text-white text-lg font-semibold mb-1">{character?.name}</p>
                      <p className="text-white/50 text-sm mb-8">{callSettings.model} &middot; {callSettings.uiOverlay}</p>
                      <button onClick={startCall} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30">
                        <Phone className="w-7 h-7 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {(callState === "ringing" || callState === "active") && (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-130px)] bg-muted/30">
              <div className="w-[375px]">
                <div className="bg-foreground rounded-[40px] p-2 shadow-2xl">
                  <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-[32px] overflow-hidden aspect-[9/16] flex flex-col relative">
                    {callSettings.showTimer && callState === "active" && (
                      <div className="absolute top-6 left-0 right-0 text-center z-10">
                        <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full"><Timer className="w-3 h-3 inline mr-1" />0:42</span>
                      </div>
                    )}
                    {callState === "ringing" && (
                      <div className="absolute top-6 left-0 right-0 text-center"><span className="text-white/60 text-xs">Connecting...</span></div>
                    )}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto ${callState === "ringing" ? "animate-pulse" : ""}`}>
                          <span className="text-5xl font-semibold text-white">{character?.name[0]}</span>
                        </div>
                        <p className="text-white text-xl font-semibold mb-1">{character?.name}</p>
                        <p className="text-white/50 text-sm">{callState === "ringing" ? "Ringing..." : "Connected"}</p>
                      </div>
                    </div>
                    {showCaptions && callState === "active" && (
                      <div className="px-6 pb-4"><div className="bg-black/60 rounded-xl p-3"><p className="text-white text-sm text-center">&ldquo;Hey there! What&apos;s on your mind today?&rdquo;</p></div></div>
                    )}
                    <div className="px-6 pb-8">
                      <div className="flex items-center justify-center gap-6">
                        <button onClick={() => setIsMuted(!isMuted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? "bg-white text-foreground" : "bg-white/20 text-white"}`}>
                          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors">
                          <PhoneOff className="w-6 h-6 text-white" />
                        </button>
                        <button onClick={() => setShowCaptions(!showCaptions)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showCaptions ? "bg-white text-foreground" : "bg-white/20 text-white"}`}>
                          <Captions className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {callState === "ended" && (
            <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-3xl">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-1">Call Summary</h2>
                <p className="text-sm text-muted-foreground">{character?.name} &middot; {callSettings.model} &middot; 0:42</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">LLM Analysis</h3>
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">Character maintained consistent persona throughout. Tone was appropriately warm. Area for improvement: could have acknowledged the user&apos;s emotional state more explicitly before pivoting to analysis.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tester Notes</h3>
                  <textarea placeholder="Add your observations..." className="w-full h-28 px-4 py-3 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <button onClick={() => setCallState("settings")} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">New Call</button>
                  <Link href="/evaluate" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">Run Evaluation</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogue Test Tab */}
      {activeTab === "dialogue" && (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[320px] border-b md:border-b-0 md:border-r border-border p-4 sm:p-6 space-y-6 md:sticky md:top-[130px] md:self-start md:max-h-[calc(100vh-130px)] md:overflow-y-auto">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Character</label>
              <select value={dialogueCharacter} onChange={(e) => setDialogueCharacter(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                {characters.map((c) => <option key={c.id} value={c.id}>{c.name} (v{c.version})</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User Persona</label>
                <button onClick={() => setActiveTab("personas")} className="text-xs text-accent hover:underline flex items-center gap-0.5"><Plus className="w-3 h-3" /> New</button>
              </div>
              <select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                {userPersonas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Number of Turns</label>
              <div className="flex items-center gap-3">
                <input type="range" min={2} max={20} value={turns} onChange={(e) => setTurns(Number(e.target.value))} className="flex-1 accent-accent" />
                <span className="text-sm font-medium text-foreground w-8 text-center">{turns}</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
              <MessageSquare className="w-4 h-4" /> Generate Dialogue
            </button>
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-8">
            {sampleTest && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Generated Dialogue</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{dialogueChar?.name} with {sampleTest.personaName} &middot; {sampleTest.turns} turns</p>
                  </div>
                  <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPlaying ? "bg-foreground text-white" : "bg-muted text-foreground hover:bg-border"}`}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play Dialogue"}
                  </button>
                </div>
                {isPlaying && (
                  <div className="bg-foreground text-white rounded-xl p-4 mb-6 flex items-center gap-4">
                    <Pause className="w-5 h-5 cursor-pointer" onClick={() => setIsPlaying(false)} />
                    <div className="flex-1"><div className="h-1 bg-white/20 rounded-full"><div className="h-1 bg-white rounded-full w-1/3 transition-all" /></div></div>
                    <span className="text-xs">0:24 / 1:12</span>
                  </div>
                )}
                <div className="space-y-4">
                  {sampleTest.transcript.map((turn, i) => (
                    <div key={i} className={`flex gap-4 ${turn.flagged ? "bg-danger/5 -mx-4 px-4 py-3 rounded-lg border border-danger/20" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${turn.speaker === "character" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                        {turn.speaker === "character" ? dialogueChar?.name[0] : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">{turn.speaker === "character" ? dialogueChar?.name : sampleTest.personaName}</span>
                          <button className={`p-1 rounded hover:bg-muted transition-colors ${turn.flagged ? "text-danger" : "text-muted-foreground/30 hover:text-muted-foreground"}`}><Flag className="w-3.5 h-3.5" /></button>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{turn.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Session Archive Tab */}
      {activeTab === "archive" && (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <StatCard icon={Phone} label="Call Sessions" value={callTestSessions.length} />
            <StatCard icon={MessageSquare} label="Dialogue Tests" value={dialogueTests.length} />
          </div>

          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-4">Recent Call Sessions</h2>
            <div className="space-y-3">
              {callTestSessions.map((session) => {
                const char = characters.find((c) => c.id === session.characterId);
                return (
                  <div key={session.id} className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">{char?.name[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{char?.name}</p>
                          <p className="text-xs text-muted-foreground">Model: {session.model} &middot; {Math.floor(session.duration / 60)}:{String(session.duration % 60).padStart(2, "0")} &middot; {session.settings.uiOverlay}</p>
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

          <section>
            <h2 className="text-base font-semibold text-foreground mb-4">Recent Dialogue Tests</h2>
            <div className="space-y-3">
              {dialogueTests.map((test) => {
                const char = characters.find((c) => c.id === test.characterId);
                return (
                  <div key={test.id} className="border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">{char?.name[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{char?.name}</p>
                          <p className="text-xs text-muted-foreground">Persona: {test.personaName} &middot; {test.turns} turns</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Play className="w-4 h-4" /></button>
                        <span className="text-xs text-muted-foreground">{new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      {test.transcript.slice(0, 2).map((turn, i) => (
                        <div key={i} className="flex gap-2">
                          <span className={`text-xs font-medium shrink-0 w-16 ${turn.speaker === "character" ? "text-accent" : "text-muted-foreground"}`}>{turn.speaker === "character" ? char?.name : "User"}</span>
                          <p className="text-xs text-foreground line-clamp-1">{turn.text}</p>
                        </div>
                      ))}
                      {test.transcript.length > 2 && <p className="text-xs text-muted-foreground">+{test.transcript.length - 2} more turns</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Personas Tab */}
      {activeTab === "personas" && (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl">
          {showNewPersonaForm && (
            <div className="border border-accent/30 rounded-xl p-6 mb-6 bg-accent-light/20">
              <h3 className="text-sm font-semibold text-foreground mb-4">Create New Persona</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Persona Name</label>
                  <input type="text" placeholder="e.g., Enthusiastic Explorer" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                  <textarea placeholder="Describe this persona..." value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Behavior Pattern</label>
                  <textarea placeholder="How does this persona behave?" value={newForm.behavior} onChange={(e) => setNewForm((f) => ({ ...f, behavior: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => { setShowNewPersonaForm(false); setNewForm(emptyForm); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">Create Persona</button>
                <button onClick={() => { setShowNewPersonaForm(false); setNewForm(emptyForm); }} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">Cancel</button>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-6">Reusable user personas for dialogue testing. Shared across the team.</p>
          <div className="space-y-3">
            {userPersonas.map((persona) => {
              const isExpanded = expandedId === persona.id;
              const isEditing = editingId === persona.id;
              return (
                <div key={persona.id} className="border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedId(isExpanded && !isEditing ? null : persona.id)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center"><UserCircle className="w-5 h-5 text-accent" /></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{persona.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{persona.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" />{persona.createdBy}</span>
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
                          <div className="bg-muted rounded-lg p-3"><p className="text-sm text-foreground leading-relaxed">{persona.behavior}</p></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                        <button onClick={(e) => { e.stopPropagation(); startEditing(persona); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"><Edit3 className="w-3 h-3" /> Edit</button>
                        <button onClick={() => setActiveTab("dialogue")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors"><MessageSquare className="w-3 h-3" /> Use in dialogue test</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-danger hover:bg-muted rounded-lg transition-colors ml-auto"><Trash2 className="w-3 h-3" /> Delete</button>
                      </div>
                    </div>
                  )}
                  {isExpanded && isEditing && (
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      <div className="space-y-4">
                        <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Persona Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20" /></div>
                        <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label><textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" /></div>
                        <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Behavior Pattern</label><textarea value={editForm.behavior} onChange={(e) => setEditForm((f) => ({ ...f, behavior: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" /></div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <button onClick={() => { setEditingId(null); setEditForm(emptyForm); }} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"><Check className="w-3.5 h-3.5" /> Save</button>
                        <button onClick={() => { setEditingId(null); setEditForm(emptyForm); }} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-accent" : "bg-border"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
