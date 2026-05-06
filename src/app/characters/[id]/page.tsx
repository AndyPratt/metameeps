"use client";

import { use, useState } from "react";
import Link from "next/link";
import { characters, voices, dialogueTests, callTestSessions, evalRuns } from "@/lib/mock-data";
import {
  Clock,
  User,
  Tag,
  Play,
  Mic,
  Image as ImageIcon,
  Settings,
  Plus,
  ExternalLink,
  Save,
  RotateCcw,
  GitCompare,
  Check,
  Eye,
  Edit3,
  X,
  BookOpen,
  Clapperboard,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Mountain,
} from "lucide-react";

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const character = characters.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<"overview" | "voice" | "scenes" | "history">("overview");
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [versionNote, setVersionNote] = useState("");
  const [hasEdits, setHasEdits] = useState(false);
  const [previewingVersion, setPreviewingVersion] = useState<number | null>(null);

  if (!character) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Character not found.</p>
        <Link href="/characters" className="text-accent text-sm mt-2 inline-block">Back to characters</Link>
      </div>
    );
  }

  const characterTests = dialogueTests.filter((t) => t.characterId === id);
  const characterCalls = callTestSessions.filter((t) => t.characterId === id);
  const characterEvals = evalRuns.filter((e) => e.characterId === id);
  const voice = voices.find((v) => v.id === character.voiceId);

  const viewingVersion = previewingVersion ?? character.version;
  const isPreviewingOld = previewingVersion !== null && previewingVersion !== character.version;

  const hasScenes = character.scenes.length > 0;

  const config = character.configurations[0] || null;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "voice" as const, label: "Voice & Embodiment" },
    ...(hasScenes ? [{ id: "scenes" as const, label: `Scenes (${character.scenes.length})` }] : []),
    { id: "history" as const, label: "Version History" },
  ];

  return (
    <div className="min-h-screen">
      {/* Preview banner */}
      {isPreviewingOld && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-warning" />
            <p className="text-sm text-foreground">
              Previewing <span className="font-semibold">v{previewingVersion}</span> — this is a read-only view of a previous version
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPreviewingVersion(null); }}
              className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-foreground hover:bg-muted transition-colors"
            >
              Back to v{character.version}
            </button>
            <button
              onClick={() => { setPreviewingVersion(null); setHasEdits(true); }}
              className="px-3 py-1.5 bg-warning text-white rounded-lg text-xs font-medium hover:bg-warning/90 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Restore this version
            </button>
          </div>
        </div>
      )}

      <div className={`border-b border-border bg-white sticky ${isPreviewingOld ? "top-[49px]" : "top-0"} z-10`}>
        <div className="px-4 sm:px-6 md:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl font-semibold text-accent">
                {character.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{character.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{character.createdBy}</span>
                  <span className="flex items-center gap-1">
                    v{viewingVersion}
                    {isPreviewingOld && <span className="text-warning text-xs">(viewing)</span>}
                  </span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(character.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {hasEdits && !isPreviewingOld && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save as v{character.version + 1}
                </button>
              )}
              {!isPreviewingOld && (
                <>
                  <button
                    onClick={() => setHasEdits(true)}
                    className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-border transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <Link href={`/test/dialogue?character=${id}`} className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground hover:bg-border transition-colors">
                    Test Dialogue
                  </Link>
                  <Link href={`/test/call?character=${id}`} className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    Start Call
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-0 overflow-x-auto">
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

      <div className="p-4 sm:p-6 md:p-8 max-w-5xl">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {config ? (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-lg text-sm font-medium text-accent">
                    <Tag className="w-3.5 h-3.5" />
                    {config.product}
                  </span>
                  <span className="text-sm text-muted-foreground">{config.platform}</span>
                  <span className="text-xs text-muted-foreground ml-auto">UI: {config.uiOverlay}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground italic">No product or platform assigned</span>
                </div>
              )}

              <Section title="Identity">
                <p className="text-sm text-foreground leading-relaxed">{character.identity}</p>
              </Section>
              <Section title="Personality">
                <p className="text-sm text-foreground leading-relaxed">{character.personality}</p>
              </Section>
              <Section title="Communication Style">
                <p className="text-sm text-foreground leading-relaxed">{character.communicationStyle}</p>
              </Section>
              <Section title="Goal / JTBD">
                <p className="text-sm text-foreground leading-relaxed">{character.goal}</p>
              </Section>
              <Section title="Biography">
                <p className="text-sm text-foreground leading-relaxed">{character.biography}</p>
              </Section>

              {config?.promptConstraints && (
                <Section title="Prompt Constraints">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-foreground leading-relaxed">{config.promptConstraints}</p>
                  </div>
                </Section>
              )}

              <SystemPromptBlock character={character} />
            </div>
            <div className="space-y-6">
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Character Preview</h3>
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-semibold text-accent">{character.name[0]}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{character.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">No image uploaded</p>
                  </div>
                </div>
                {voice && (
                  <div className="flex items-center justify-between py-2.5 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{voice.name}</span>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Activity</h3>
                <div className="space-y-2">
                  <ActivityStat label="Dialogue Tests" value={characterTests.length} />
                  <ActivityStat label="Call Sessions" value={characterCalls.length} />
                  <ActivityStat label="Eval Runs" value={characterEvals.length} />
                  <ActivityStat label="Configurations" value={character.configurations.length} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "voice" && (
          <VoiceEmbodimentTab character={character} voices={voices} />
        )}

        {activeTab === "scenes" && hasScenes && (
          <div className="space-y-8">
            {character.scenes.map((scene) => (
              <div key={scene.id}>
                <div className="flex items-center gap-2.5 mb-1">
                  <Clapperboard className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">{scene.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{scene.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Format</p>
                    <p className="text-sm font-medium text-foreground">{scene.format}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Max Proactive Streak</p>
                    <p className="text-sm font-medium text-foreground">{scene.maxProactiveStreak}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Chapters</p>
                    <p className="text-sm font-medium text-foreground">{scene.chapters.length}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Chapters</h3>
                  </div>
                  <div className="space-y-3">
                    {scene.chapters.map((chapter, idx) => (
                      <SceneChapterCard key={chapter.id} chapter={chapter} index={idx} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Click any version to preview it. You can restore a previous version or compare it with the current one.
                </p>
              </div>
            </div>

            <div className="space-y-0">
              {character.versions.slice().reverse().map((v, i) => {
                const isCurrent = v.version === character.version;
                const isSelected = selectedVersion === v.version;

                return (
                  <div key={v.version}>
                    <button
                      onClick={() => setSelectedVersion(isSelected ? null : v.version)}
                      className={`w-full flex gap-4 text-left transition-colors rounded-lg -mx-3 px-3 py-3 ${
                        isSelected ? "bg-accent-light" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          isCurrent ? "bg-accent text-white" : isSelected ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        }`}>
                          v{v.version}
                        </div>
                        {i < character.versions.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{v.summary}</p>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold rounded uppercase">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {v.createdBy} &middot; {new Date(v.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="ml-[52px] mb-4 mt-1">
                        <div className="border border-border rounded-xl p-4 bg-white">
                          <p className="text-xs text-muted-foreground mb-3">
                            {isCurrent ? "This is the current version." : `Version ${v.version} — created ${new Date(v.createdAt).toLocaleDateString()}`}
                          </p>

                          <div className="bg-muted rounded-lg p-3 mb-4">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Changes in this version</p>
                            <p className="text-sm text-foreground">{v.summary}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isCurrent && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setPreviewingVersion(v.version); setActiveTab("overview"); setSelectedVersion(null); }}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-border transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview this version
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setPreviewingVersion(null); setHasEdits(true); setSelectedVersion(null); }}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-warning/10 text-warning rounded-lg text-xs font-medium hover:bg-warning/20 transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Restore as current
                                </button>
                                <Link
                                  href="/iterate"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-accent font-medium hover:underline"
                                >
                                  <GitCompare className="w-3.5 h-3.5" />
                                  Compare with current
                                </Link>
                              </>
                            )}
                            {isCurrent && (
                              <p className="text-xs text-success flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Active version
                              </p>
                            )}
                          </div>
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

      {/* Save version modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[440px] shadow-xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Save new version</h2>
              <button onClick={() => setShowSaveModal(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground mb-4">
                This will create <span className="font-semibold text-foreground">v{character.version + 1}</span> of {character.name}. The current version (v{character.version}) will still be accessible in version history.
              </p>
              <label className="block text-sm font-medium text-foreground mb-1.5">What changed?</label>
              <textarea
                placeholder="Describe what you changed in this version..."
                value={versionNote}
                onChange={(e) => setVersionNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
              />
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowSaveModal(false); setHasEdits(false); setVersionNote(""); }}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save v{character.version + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function ActivityStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function EmbodimentUploader({ type }: { type: "character" | "scene" }) {
  const [mode, setMode] = useState<"create" | "extract" | "upload">("create");
  const label = type === "character" ? "character image" : "background scene";

  return (
    <div>
      <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 w-fit mb-4">
        {(["create", "extract", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
              mode === m ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "create" && (
        <div className="space-y-3">
          <textarea
            placeholder={`Describe the ${label} you want to generate...`}
            className="w-full h-24 px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Variations:</label>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {[1, 2, 4].map((n) => (
                <button key={n} className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-white hover:shadow-sm transition-colors">
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            Generate
          </button>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "extract" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Paste a Meta AI vibe URL..."
            className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="text-xs text-muted-foreground">
            The model will automatically extract the {type === "character" ? "character and background" : "background scene"} from the vibe.
          </p>
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            Extract
          </button>
        </div>
      )}

      {mode === "upload" && (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors cursor-pointer">
          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Drop {label} here</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, or WebP up to 10MB</p>
        </div>
      )}
    </div>
  );
}

function VoiceEmbodimentTab({ character, voices: allVoices }: { character: typeof import("@/lib/mock-data").characters[number]; voices: typeof import("@/lib/mock-data").voices }) {
  const [editingVoice, setEditingVoice] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const currentVoice = allVoices.find((v) => v.id === character.voiceId);
  const hasImage = character.characterImage !== null;

  return (
    <div className="space-y-8">
      {/* Voice */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Voice</h3>
          <button
            onClick={() => setEditingVoice(!editingVoice)}
            className="text-xs text-accent hover:underline"
          >
            {editingVoice ? "Done" : "Change voice"}
          </button>
        </div>

        {!editingVoice ? (
          <div className="border border-accent rounded-xl p-4 bg-accent-light flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{currentVoice?.name || "No voice selected"}</p>
                {currentVoice && (
                  <p className="text-xs text-muted-foreground">{currentVoice.gender} &middot; {currentVoice.accent} &middot; Play.ai</p>
                )}
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border">
              <Play className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {allVoices.map((v) => (
              <div
                key={v.id}
                className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                  v.id === character.voiceId ? "border-accent bg-accent-light" : "border-border hover:border-accent/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    v.id === character.voiceId ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.gender} &middot; {v.accent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {v.id === character.voiceId && (
                    <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold rounded uppercase">Current</span>
                  )}
                  <button className="p-2 rounded-md hover:bg-muted text-muted-foreground">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appearance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Appearance</h3>
          <button
            onClick={() => setEditingImage(!editingImage)}
            className="text-xs text-accent hover:underline"
          >
            {editingImage ? "Done" : "Edit appearance"}
          </button>
        </div>

        {!editingImage ? (
          <div className="space-y-4">
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{hasImage ? "Character appearance" : "No appearance set"}</p>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Look: <span className="text-foreground font-medium">Casual</span></span>
                  <span>Background: <span className="text-foreground font-medium">Cozy Living Room</span></span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Looks</p>
              <div className="flex gap-2">
                {["Casual", "Professional", "Sporty"].map((look, i) => (
                  <div key={look} className={`w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-[10px] font-medium cursor-pointer transition-colors ${i === 0 ? "border-2 border-accent text-accent" : "border border-border text-muted-foreground hover:border-accent/30"}`}>
                    {look.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Backgrounds</p>
              <div className="flex gap-2">
                {["Living Room", "Coffee Shop", "City Park"].map((bg, i) => (
                  <div key={bg} className={`w-20 h-12 rounded-lg bg-muted flex items-center justify-center cursor-pointer transition-colors ${i === 0 ? "border-2 border-accent" : "border border-border hover:border-accent/30"}`}>
                    <Mountain className="w-4 h-4 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmbodimentUploader type="character" />
        )}
      </div>
    </div>
  );
}

function SystemPromptBlock({ character }: { character: typeof import("@/lib/mock-data").characters[number] }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = [
    `# Identity\n${character.identity}`,
    `# Personality\n${character.personality}`,
    `# Communication Style\n${character.communicationStyle}`,
    `# Goal\n${character.goal}`,
    `# Biography\n${character.biography}`,
    ...character.configurations.map(
      (cfg) => `# ${cfg.product} — ${cfg.platform} Constraints\n${cfg.promptConstraints}`
    ),
  ].join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-4 border-t border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left group"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <FileText className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
          System Prompt
        </span>
      </button>

      {expanded && (
        <div className="mt-3">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white transition-colors z-10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
            <pre className="bg-muted rounded-xl p-4 pr-24 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
              {prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function SceneChapterCard({ chapter, index }: { chapter: { id: string; title: string; type: string; content: string }; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, string> = {
    INTRO: "bg-success/10 text-success",
    STANDARD: "bg-muted text-muted-foreground",
    BRANCHING: "bg-accent/10 text-accent",
    OUTRO: "bg-warning/10 text-warning",
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <span className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{chapter.title}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${typeColors[chapter.type] || typeColors.STANDARD}`}>
          {chapter.type}
        </span>
      </button>
      {expanded && (
        <div className="px-5 pb-4 pt-0 ml-[60px]">
          <p className="text-sm text-foreground leading-relaxed">{chapter.content}</p>
        </div>
      )}
    </div>
  );
}
