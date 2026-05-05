"use client";

import { useState } from "react";
import Link from "next/link";
import { voices, products, platforms } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Mic,
  Image as ImageIcon,
  Mountain,
  ExternalLink,
  Check,
  Sparkles,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Search,
  Clapperboard,
  BookOpen,
  SlidersHorizontal,
  Lightbulb,
  X,
} from "lucide-react";

type Step = "prompt" | "voice-embodiment" | "scenes";

interface Chapter {
  id: string;
  title: string;
  type: "STANDARD" | "INTRO" | "OUTRO" | "BRANCHING";
  content: string;
  turnTakingRules: string;
  progressionCriteria: string;
  suggestedPrompts: string[];
  excludedPersonas: string[];
  uiElements: string[];
  expanded: boolean;
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>("prompt");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [imageMode, setImageMode] = useState<"create" | "extract" | "upload">("create");
  const [sceneMode, setSceneMode] = useState<"create" | "extract" | "upload">("create");
  const [imageVariations, setImageVariations] = useState(4);

  const [form, setForm] = useState({
    name: "",
    identity: "",
    personality: "",
    communicationStyle: "",
    goal: "",
    biography: "",
    product: "",
    platform: "",
  });

  const [sceneDetails, setSceneDetails] = useState({
    title: "",
    description: "",
    format: "UNSTRUCTURED",
    maxProactiveStreak: 3,
  });

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "ch-1",
      title: "",
      type: "STANDARD",
      content: "",
      turnTakingRules: "",
      progressionCriteria: "",
      suggestedPrompts: [],
      excludedPersonas: [],
      uiElements: [],
      expanded: true,
    },
  ]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const showScenes = form.product === "C50" && form.platform === "1P Characters";

  const stepLabels: Record<Step, string> = {
    prompt: "Step 1: Define the character prompt",
    "voice-embodiment": "Step 2: Voice & Embodiment",
    scenes: "Step 3: Scenes",
  };

  const nextStep = (): Step | null => {
    if (step === "prompt") return "voice-embodiment";
    if (step === "voice-embodiment" && showScenes) return "scenes";
    return null;
  };

  const prevStep = (): Step | null => {
    if (step === "scenes") return "voice-embodiment";
    if (step === "voice-embodiment") return "prompt";
    return null;
  };

  const isLastStep = step === "scenes" || (step === "voice-embodiment" && !showScenes);

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `ch-${Date.now()}`,
        title: "",
        type: "STANDARD",
        content: "",
        turnTakingRules: "",
        progressionCriteria: "",
        suggestedPrompts: [],
        excludedPersonas: [],
        uiElements: [],
        expanded: true,
      },
    ]);
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch))
    );
  };

  const removeChapter = (id: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  };

  const moveChapter = (id: string, direction: "up" | "down") => {
    setChapters((prev) => {
      const idx = prev.findIndex((ch) => ch.id === id);
      if (
        (direction === "up" && idx === 0) ||
        (direction === "down" && idx === prev.length - 1)
      )
        return prev;
      const next = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const addSuggestedPrompt = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, suggestedPrompts: [...ch.suggestedPrompts, ""] }
          : ch
      )
    );
  };

  const updateSuggestedPrompt = (chapterId: string, promptIndex: number, value: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              suggestedPrompts: ch.suggestedPrompts.map((p, i) =>
                i === promptIndex ? value : p
              ),
            }
          : ch
      )
    );
  };

  const removeSuggestedPrompt = (chapterId: string, promptIndex: number) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              suggestedPrompts: ch.suggestedPrompts.filter((_, i) => i !== promptIndex),
            }
          : ch
      )
    );
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/characters" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Create Character</h1>
              <p className="text-xs text-muted-foreground">
                {stepLabels[step]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {prevStep() && (
              <button
                onClick={() => setStep(prevStep()!)}
                className="flex items-center gap-1.5 px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {isLastStep ? (
              <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                <Check className="w-4 h-4" />
                Create Character
              </button>
            ) : (
              <button
                onClick={() => { const ns = nextStep(); if (ns) setStep(ns); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="px-8">
          <div className="flex gap-0">
            <button
              onClick={() => setStep("prompt")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                step === "prompt" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Character Prompt
            </button>
            <button
              onClick={() => setStep("voice-embodiment")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                step === "voice-embodiment" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Voice & Embodiment
            </button>
            {showScenes && (
              <button
                onClick={() => setStep("scenes")}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  step === "scenes" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Scenes
              </button>
            )}
          </div>
        </div>
      </div>

      {step === "prompt" && (
        <div className="flex">
          <div className="flex-1 p-8 max-w-2xl">
            <div className="space-y-6">
              <Field label="Name" helper="Give your character a memorable name.">
                <input
                  type="text"
                  placeholder="e.g., Zara, Professor Wick, Chef Amara"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Product">
                  <select
                    value={form.product}
                    onChange={(e) => updateForm("product", e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Platform">
                  <select
                    value={form.platform}
                    onChange={(e) => updateForm("platform", e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select platform...</option>
                    {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Identity" helper="Who is this character? What defines them?">
                <textarea
                  placeholder="A witty and empathetic life coach who helps users navigate personal challenges..."
                  value={form.identity}
                  onChange={(e) => updateForm("identity", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
              </Field>

              <PromptFieldWithSuggestions
                label="Personality"
                helper="Key personality traits and behavioral tendencies."
                placeholder="Warm, quick-witted, insightful, occasionally sarcastic but always kind..."
                value={form.personality}
                onChange={(v) => updateForm("personality", v)}
                rows={3}
                suggestions={personalitySuggestions}
                sliders={personalitySliders}
              />

              <PromptFieldWithSuggestions
                label="Communication Style"
                helper="How does this character speak? Tone, vocabulary, patterns."
                placeholder="Conversational and casual, but can shift to serious when needed..."
                value={form.communicationStyle}
                onChange={(v) => updateForm("communicationStyle", v)}
                rows={3}
                suggestions={communicationStyleSuggestions}
                sliders={communicationStyleSliders}
              />

              <PromptFieldWithSuggestions
                label="Goal / JTBD"
                helper="What is this character's purpose? What job does it do for the user?"
                placeholder="Help users gain clarity on personal decisions and build confidence..."
                value={form.goal}
                onChange={(v) => updateForm("goal", v)}
                rows={2}
                suggestions={goalSuggestions}
              />

              <PromptFieldWithSuggestions
                label="Biography"
                helper="Backstory and context that shapes how the character talks and behaves."
                placeholder="Zara is a seasoned life coach with a background in psychology and improv comedy..."
                value={form.biography}
                onChange={(v) => updateForm("biography", v)}
                rows={5}
                suggestions={biographySuggestions}
                maxLength={150}
              />
            </div>
          </div>

          <div className="w-[360px] border-l border-border p-6 sticky top-[120px] self-start">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Character Preview</h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                {form.name ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-semibold text-accent">{form.name[0]?.toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{form.name}</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Start filling in details to preview your character</p>
                  </div>
                )}
              </div>
              {form.name && (
                <div className="p-4 border-t border-border">
                  <p className="text-xs font-medium text-foreground mb-1">{form.name}</p>
                  {form.identity && <p className="text-xs text-muted-foreground line-clamp-2">{form.identity}</p>}
                  {form.goal && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Goal</p>
                      <p className="text-xs text-foreground line-clamp-2">{form.goal}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === "voice-embodiment" && (
        <div className="p-8 max-w-4xl space-y-10">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">Voice Selection</h2>
            <p className="text-sm text-muted-foreground mb-4">Choose a voice from Play.ai or upload a voice sample.</p>
            <div className="grid grid-cols-2 gap-3">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`border rounded-xl p-4 flex items-center justify-between text-left transition-all ${
                    selectedVoice === v.id
                      ? "border-accent bg-accent-light"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedVoice === v.id ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.gender} &middot; {v.accent}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="mt-4 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/30 transition-colors cursor-pointer">
              <Mic className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">Upload voice sample</p>
              <p className="text-xs text-muted-foreground">MP3, WAV, or M4A up to 5MB</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">Character Image</h2>
            <p className="text-sm text-muted-foreground mb-4">Create, extract, or upload a character image for embodiment.</p>

            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 w-fit mb-5">
              {(["create", "extract", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setImageMode(m)}
                  className={`px-4 py-2 rounded-md text-sm capitalize transition-colors ${
                    imageMode === m ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {imageMode === "create" && (
              <div className="space-y-4">
                <textarea
                  placeholder="Describe the character you want to generate... e.g., 'A warm, approachable woman in her 30s with curly auburn hair and kind brown eyes, wearing a casual blazer'"
                  className="w-full h-28 px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Variations:</span>
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                      {[1, 2, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => setImageVariations(n)}
                          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                            imageVariations === n ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: imageVariations }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-accent/30 transition-colors cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imageMode === "extract" && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Paste a Meta AI vibe URL... e.g., meta.ai/@user/post/..."
                    className="flex-1 px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors shrink-0">
                    <ExternalLink className="w-4 h-4" />
                    Extract
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The model will automatically separate the character from the background scene.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dashed border-border rounded-xl p-8 text-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Extracted character</p>
                  </div>
                  <div className="border border-dashed border-border rounded-xl p-8 text-center">
                    <Clapperboard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Extracted scene</p>
                  </div>
                </div>
              </div>
            )}

            {imageMode === "upload" && (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors cursor-pointer">
                <ImageIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Drop character image here</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WebP up to 10MB</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-1">Background Scene</h2>
            <p className="text-sm text-muted-foreground mb-4">Optional visual background for the character&apos;s embodiment.</p>

            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 w-fit mb-5">
              {(["create", "extract", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSceneMode(m)}
                  className={`px-4 py-2 rounded-md text-sm capitalize transition-colors ${
                    sceneMode === m ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {sceneMode === "create" && (
              <div className="space-y-4">
                <textarea
                  placeholder="Describe the background scene... e.g., 'A cozy coffee shop with warm lighting, exposed brick walls, and plants hanging from the ceiling'"
                  className="w-full h-24 px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
                <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Generate Scene
                </button>
              </div>
            )}

            {sceneMode === "extract" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Paste a Meta AI vibe URL..."
                  className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                />
                <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Extract Scene
                </button>
              </div>
            )}

            {sceneMode === "upload" && (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors cursor-pointer">
                <Mountain className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Drop background scene here</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WebP up to 10MB</p>
              </div>
            )}
          </section>
        </div>
      )}

      {step === "scenes" && (
        <div className="p-8 max-w-4xl space-y-10">
          {/* Scene Details */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <Clapperboard className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-semibold text-foreground">Scene Details</h2>
            </div>
            <div className="border-t border-border mt-3 pt-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Scene Title</label>
                <p className="text-xs text-muted-foreground mb-2">
                  {sceneDetails.title.length}/50 max characters
                </p>
                <input
                  type="text"
                  placeholder="<Custom>"
                  value={sceneDetails.title}
                  onChange={(e) => {
                    if (e.target.value.length <= 50)
                      setSceneDetails((s) => ({ ...s, title: e.target.value }));
                  }}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Scene Description</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Describe the scene in detail ({sceneDetails.description.length} chars)
                </p>
                <textarea
                  placeholder="Describe the scene in detail..."
                  value={sceneDetails.description}
                  onChange={(e) => setSceneDetails((s) => ({ ...s, description: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Format</label>
                  <select
                    value={sceneDetails.format}
                    onChange={(e) => setSceneDetails((s) => ({ ...s, format: e.target.value }))}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="UNSTRUCTURED">UNSTRUCTURED</option>
                    <option value="STRUCTURED">STRUCTURED</option>
                    <option value="FREEFORM">FREEFORM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Max Proactive Streak</label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Limit bot messages without user action
                  </p>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={sceneDetails.maxProactiveStreak}
                    onChange={(e) => setSceneDetails((s) => ({ ...s, maxProactiveStreak: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Chapters */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-foreground" />
                <h2 className="text-base font-semibold text-foreground">Chapters</h2>
              </div>
              <button
                onClick={addChapter}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Define the narrative flow of your scene.
            </p>

            <div className="space-y-4">
              {chapters.map((chapter, idx) => (
                <div
                  key={chapter.id}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  {/* Chapter header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-muted/50">
                    <button
                      onClick={() => updateChapter(chapter.id, { expanded: !chapter.expanded })}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {chapter.expanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {chapter.title || "<Name your chapter>"}
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-muted rounded text-[11px] font-medium text-muted-foreground uppercase">
                        {chapter.type}
                      </span>
                      <button
                        onClick={() => moveChapter(chapter.id, "up")}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        disabled={idx === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveChapter(chapter.id, "down")}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        disabled={idx === chapters.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={addChapter}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeChapter(chapter.id)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-danger disabled:opacity-30"
                        disabled={chapters.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter body */}
                  {chapter.expanded && (
                    <div className="px-5 py-5 space-y-5">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm text-accent font-medium mb-1.5">Chapter Title</label>
                          <input
                            type="text"
                            placeholder="<Name your chapter>"
                            value={chapter.title}
                            onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div className="w-36">
                          <label className="block text-sm text-accent font-medium mb-1.5">Type</label>
                          <select
                            value={chapter.type}
                            onChange={(e) =>
                              updateChapter(chapter.id, {
                                type: e.target.value as Chapter["type"],
                              })
                            }
                            className="w-full px-3 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                          >
                            <option value="STANDARD">Standard</option>
                            <option value="INTRO">Intro</option>
                            <option value="OUTRO">Outro</option>
                            <option value="BRANCHING">Branching</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-accent font-medium mb-1.5">Content</label>
                        <textarea
                          placeholder="<Describe the arc of the story>"
                          value={chapter.content}
                          onChange={(e) => updateChapter(chapter.id, { content: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-accent font-medium mb-1.5">Turn Taking Rules</label>
                          <textarea
                            placeholder="<e.g. the characters must take turns>"
                            value={chapter.turnTakingRules}
                            onChange={(e) => updateChapter(chapter.id, { turnTakingRules: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-accent font-medium mb-1.5">Progression Criteria</label>
                          <textarea
                            placeholder="<e.g. the goal for the characters to accomplish>"
                            value={chapter.progressionCriteria}
                            onChange={(e) => updateChapter(chapter.id, { progressionCriteria: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-foreground">Suggested Prompts</label>
                        </div>
                        {chapter.suggestedPrompts.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {chapter.suggestedPrompts.map((prompt, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter a suggested prompt..."
                                  value={prompt}
                                  onChange={(e) => updateSuggestedPrompt(chapter.id, pIdx, e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                  onClick={() => removeSuggestedPrompt(chapter.id, pIdx)}
                                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-danger"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => addSuggestedPrompt(chapter.id)}
                          className="text-sm text-accent hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add prompt
                        </button>
                      </div>

                      <div className="border-t border-border pt-4">
                        <label className="text-sm font-semibold text-foreground">Persona Exclusions</label>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                          Personas that should not participate in this chapter
                        </p>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">
                            Excluded Personas &middot; <span className="italic">Optional</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground mb-1.5">
                            Select personas to exclude from this chapter
                          </p>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search personas to exclude..."
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-foreground">UI Elements</label>
                          <select className="px-3 py-1.5 bg-muted rounded-lg text-xs text-foreground outline-none">
                            <option>+ Add element...</option>
                            <option>Timer</option>
                            <option>Progress Bar</option>
                            <option>Quick Replies</option>
                            <option>Media Carousel</option>
                          </select>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">No UI elements configured</p>
                        <select className="w-full px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none">
                          <option>Add UI Element</option>
                          <option>Timer</option>
                          <option>Progress Bar</option>
                          <option>Quick Replies</option>
                          <option>Media Carousel</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {helper && <p className="text-xs text-muted-foreground mt-1.5">{helper}</p>}
    </div>
  );
}

interface Suggestion {
  title: string;
  description: string;
  presets?: Record<string, number>;
}

interface SliderDimension {
  label: string;
  left: string;
  right: string;
  defaultValue: number;
}

const personalitySuggestions: Suggestion[] = [
  {
    title: "Warm & Empathetic",
    description: "Deeply caring and emotionally attuned. Leads with compassion, validates feelings before offering advice, and creates a safe space for vulnerability.",
    presets: { Energy: 55, Humor: 35, Empathy: 90, Patience: 85 },
  },
  {
    title: "Witty & Sharp",
    description: "Quick with humor and clever observations. Uses wordplay and irony to keep conversations lively, but knows when to dial it back for serious moments.",
    presets: { Energy: 80, Humor: 90, Empathy: 50, Patience: 40 },
  },
  {
    title: "Calm & Grounded",
    description: "Unshakeable composure and steady presence. Brings a sense of peace to chaotic situations, speaks deliberately, and never rushes to fill silence.",
    presets: { Energy: 25, Humor: 20, Empathy: 70, Patience: 95 },
  },
];

const communicationStyleSuggestions: Suggestion[] = [
  {
    title: "Conversational & Casual",
    description: "Speaks like a close friend — relaxed, natural, uses contractions and colloquialisms. Avoids jargon and keeps things approachable without being unprofessional.",
    presets: { Formality: 15, Length: 40, Questioning: 45, "Metaphor use": 30 },
  },
  {
    title: "Storytelling & Vivid",
    description: "Paints pictures with words, uses metaphors and analogies to make abstract concepts tangible. Draws from real-world examples and weaves mini-narratives into responses.",
    presets: { Formality: 40, Length: 80, Questioning: 35, "Metaphor use": 90 },
  },
  {
    title: "Direct & Concise",
    description: "Gets to the point quickly. Short sentences, clear structure, no filler. Respects the user's time and attention while still being warm.",
    presets: { Formality: 50, Length: 15, Questioning: 25, "Metaphor use": 10 },
  },
];

const goalSuggestions: Suggestion[] = [
  { title: "Companionship & Catharsis", description: "Offers a unique form of companionship, allowing users to vent frustrations and find catharsis through empathetic listening and thoughtful reflection." },
  { title: "Entertainment & Perspective", description: "Provides pure entertainment and a fresh perspective. Helps users see their situations in a new light through humor, stories, and creative reframing." },
  { title: "Guidance & Growth", description: "Serves as a thinking partner who helps users navigate decisions, build skills, and grow through structured self-reflection and actionable advice." },
];

const biographySuggestions: Suggestion[] = [
  { title: "Academic Background", description: "Spent years in academia studying human behavior before realizing the real lessons happen outside the classroom. Now applies research to everyday conversations." },
  { title: "Life Experience", description: "Has lived in multiple countries, worked in wildly different industries, and learned that the best wisdom comes from unexpected places and diverse perspectives." },
  { title: "Creative Arts", description: "Started in the creative arts — theater, music, or writing — and brings that sense of improvisation, emotional range, and storytelling craft to every interaction." },
];

const personalitySliders: SliderDimension[] = [
  { label: "Energy", left: "Reserved", right: "Expressive", defaultValue: 50 },
  { label: "Humor", left: "Serious", right: "Playful", defaultValue: 50 },
  { label: "Empathy", left: "Analytical", right: "Emotional", defaultValue: 50 },
  { label: "Patience", left: "Direct", right: "Patient", defaultValue: 50 },
];

const communicationStyleSliders: SliderDimension[] = [
  { label: "Formality", left: "Casual", right: "Formal", defaultValue: 50 },
  { label: "Length", left: "Concise", right: "Detailed", defaultValue: 50 },
  { label: "Questioning", left: "Declarative", right: "Socratic", defaultValue: 50 },
  { label: "Metaphor use", left: "Literal", right: "Figurative", defaultValue: 50 },
];

function PromptFieldWithSuggestions({
  label,
  helper,
  placeholder,
  value,
  onChange,
  rows,
  suggestions,
  sliders,
  maxLength,
}: {
  label: string;
  helper: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  suggestions: Suggestion[];
  sliders?: SliderDimension[];
  maxLength?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    () => Object.fromEntries((sliders || []).map((s) => [s.label, s.defaultValue]))
  );

  const selectSuggestion = (s: Suggestion) => {
    onChange(s.description);
    setActiveSuggestion(s.title);
    if (s.presets && sliders) {
      setSliderValues(s.presets);
    }
  };

  const handleSliderChange = (label: string, val: number) => {
    setSliderValues((prev) => ({ ...prev, [label]: val }));
    setActiveSuggestion(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
            expanded ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {sliders ? (
            <>
              <SlidersHorizontal className="w-3 h-3" />
              {expanded ? "Hide presets & tuning" : "Presets & tuning"}
            </>
          ) : (
            <>
              <Lightbulb className="w-3 h-3" />
              {expanded ? "Hide suggestions" : "Suggestions"}
            </>
          )}
        </button>
      </div>

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setActiveSuggestion(null); }}
        rows={rows}
        className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
      />
      {maxLength && (
        <div className="text-right mt-1">
          <span className={`text-xs ${value.length > maxLength ? "text-danger" : "text-muted-foreground"}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      {helper && !expanded && <p className="text-xs text-muted-foreground mt-1.5">{helper}</p>}

      {expanded && (
        <div className="mt-3 border border-border rounded-xl overflow-hidden">
          {sliders ? (
            <div className="flex">
              {/* Suggestions — left column */}
              <div className="flex-1 p-4 border-r border-border">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Presets</p>
                <div className="space-y-2.5">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => selectSuggestion(s)}
                      className={`w-full border rounded-lg p-3 text-left transition-all ${
                        activeSuggestion === s.title
                          ? "border-accent bg-accent-light"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">{s.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => { onChange(""); setActiveSuggestion(null); setSliderValues(Object.fromEntries(sliders.map((s) => [s.label, s.defaultValue]))); }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Start from scratch
                  </button>
                </div>
              </div>

              {/* Sliders — right column */}
              <div className="w-[280px] p-4 bg-muted/30">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Fine-tune</p>
                <div className="space-y-5">
                  {sliders.map((slider) => (
                    <div key={slider.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">{slider.label}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={sliderValues[slider.label]}
                        onChange={(e) => handleSliderChange(slider.label, Number(e.target.value))}
                        className="w-full accent-accent h-1.5 mb-1"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{slider.left}</span>
                        <span className="text-[10px] text-muted-foreground">{slider.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {activeSuggestion && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-[11px] text-accent font-medium">
                      Tuned to &ldquo;{activeSuggestion}&rdquo;
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Adjust any slider to customize
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Suggestions only — no sliders (Goal, Biography) */
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => { onChange(s.description); setActiveSuggestion(s.title); }}
                    className={`border rounded-lg p-3.5 text-left transition-all ${
                      activeSuggestion === s.title
                        ? "border-accent bg-accent-light"
                        : "border-border hover:border-accent/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground mb-1.5">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { onChange(""); setActiveSuggestion(null); }}
                className="mt-3 flex items-center gap-1.5 px-3 py-2 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add your own answer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
