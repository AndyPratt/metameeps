"use client";

import { useState } from "react";
import Link from "next/link";
import { voices, apps, workstreams } from "@/lib/mock-data";
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
  Copy,
  FileText,
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

interface Scene {
  id: string;
  title: string;
  description: string;
  format: string;
  maxProactiveStreak: number;
  chapters: Chapter[];
  expanded: boolean;
}

function createEmptyScene(): Scene {
  return {
    id: `scene-${Date.now()}`,
    title: "",
    description: "",
    format: "UNSTRUCTURED",
    maxProactiveStreak: 3,
    chapters: [createEmptyChapter()],
    expanded: true,
  };
}

function createEmptyChapter(): Chapter {
  return {
    id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    type: "STANDARD",
    content: "",
    turnTakingRules: "",
    progressionCriteria: "",
    suggestedPrompts: [],
    excludedPersonas: [],
    uiElements: [],
    expanded: true,
  };
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
    voiceStyle: "",
    goal: "",
    biography: "",
    product: "",
    platform: "",
    purpose: "",
    welcomeMessage: "",
    backstory: "",
    wants: "",
    problems: "",
    visualPresence: "",
    freeform: "",
    likes: "",
    dislikes: "",
    quirks: "",
  });

  const [scenes, setScenes] = useState<Scene[]>([createEmptyScene()]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const showScenes = form.product === "Meta AI" && form.platform === "1P Characters";

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

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setScenes((prev) => prev.map((s) => (s.id === sceneId ? { ...s, ...updates } : s)));
  };

  const removeScene = (sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId));
  };

  const updateChapterInScene = (sceneId: string, chapterId: string, updates: Partial<Chapter>) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId
        ? { ...s, chapters: s.chapters.map((ch) => (ch.id === chapterId ? { ...ch, ...updates } : ch)) }
        : s
    ));
  };

  const addChapterToScene = (sceneId: string) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId ? { ...s, chapters: [...s.chapters, createEmptyChapter()] } : s
    ));
  };

  const removeChapterFromScene = (sceneId: string, chapterId: string) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId ? { ...s, chapters: s.chapters.filter((ch) => ch.id !== chapterId) } : s
    ));
  };

  const moveChapterInScene = (sceneId: string, chapterId: string, direction: "up" | "down") => {
    setScenes((prev) => prev.map((s) => {
      if (s.id !== sceneId) return s;
      const idx = s.chapters.findIndex((ch) => ch.id === chapterId);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === s.chapters.length - 1)) return s;
      const next = [...s.chapters];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return { ...s, chapters: next };
    }));
  };

  const addSuggestedPrompt = (sceneId: string, chapterId: string) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId
        ? { ...s, chapters: s.chapters.map((ch) => ch.id === chapterId ? { ...ch, suggestedPrompts: [...ch.suggestedPrompts, ""] } : ch) }
        : s
    ));
  };

  const updateSuggestedPrompt = (sceneId: string, chapterId: string, promptIndex: number, value: string) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId
        ? { ...s, chapters: s.chapters.map((ch) => ch.id === chapterId ? { ...ch, suggestedPrompts: ch.suggestedPrompts.map((p, i) => i === promptIndex ? value : p) } : ch) }
        : s
    ));
  };

  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);

  const generateChaptersFromDescription = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene || !scene.description.trim()) return;

    setGeneratingSceneId(sceneId);

    setTimeout(() => {
      const desc = scene.description.toLowerCase();
      const chapters: Chapter[] = [];
      const ts = () => `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      chapters.push({
        id: ts(), title: "Introduction", type: "INTRO",
        content: `Set the stage for the scene. Introduce the setting, establish the character's presence, and create the initial tone. The character greets the user and establishes the context for what's about to happen.`,
        turnTakingRules: "Character speaks first to set the scene. Allow the user to respond before continuing.", progressionCriteria: "User has acknowledged the introduction and shown readiness to engage.",
        suggestedPrompts: ["Tell me more about where we are.", "What are we doing here?"], excludedPersonas: [], uiElements: [], expanded: false,
      });

      if (desc.includes("problem") || desc.includes("challenge") || desc.includes("discover") || desc.includes("diagnos") || desc.includes("investigat")) {
        chapters.push({
          id: ts(), title: "Discovery & Investigation", type: "STANDARD",
          content: `The core challenge or problem is revealed. The character walks the user through understanding the situation, gathering information, and forming initial hypotheses. Build tension through unanswered questions.`,
          turnTakingRules: "Alternate between character exposition and user questions. Character should pause for user input after revealing key information.", progressionCriteria: "User has understood the core problem and has enough information to form an opinion.",
          suggestedPrompts: ["What do you think happened?", "Can you show me more details?", "What are our options?"], excludedPersonas: [], uiElements: [], expanded: false,
        });
      }

      if (desc.includes("choice") || desc.includes("decision") || desc.includes("choose") || desc.includes("branch") || desc.includes("dilemma")) {
        chapters.push({
          id: ts(), title: "The Decision Point", type: "BRANCHING",
          content: `Present the user with a meaningful choice that has real consequences. Each option should be compelling with clear trade-offs. The character presents the options without revealing which is "correct" — there may not be one.`,
          turnTakingRules: "Character presents options, then waits for the user's decision. Do not rush or influence the choice.", progressionCriteria: "User has made a clear choice and expressed their reasoning.",
          suggestedPrompts: ["I need more time to think.", "What would you do?", "What happens if we choose wrong?"], excludedPersonas: [], uiElements: [], expanded: false,
        });
      }

      if (desc.includes("conflict") || desc.includes("tension") || desc.includes("crisis") || desc.includes("struggle") || desc.includes("pressure")) {
        chapters.push({
          id: ts(), title: "Rising Tension", type: "STANDARD",
          content: `The stakes increase. Complications arise from the user's previous choices or from external factors. The character must adapt their approach based on how the conversation has developed.`,
          turnTakingRules: "Shorter, more urgent exchanges. Character can send consecutive messages to build urgency but should check in with the user.", progressionCriteria: "The crisis has peaked and the user has taken action to address it.",
          suggestedPrompts: ["What do we do now?", "Is there still time?", "I'm not sure about this."], excludedPersonas: [], uiElements: [], expanded: false,
        });
      }

      if (desc.includes("learn") || desc.includes("teach") || desc.includes("skill") || desc.includes("practice") || desc.includes("exercise")) {
        chapters.push({
          id: ts(), title: "Guided Practice", type: "STANDARD",
          content: `The character guides the user through a hands-on exercise or skill-building activity. Focus on learning by doing, with the character providing real-time feedback and encouragement.`,
          turnTakingRules: "Character provides instructions in small steps, waits for user to attempt each step before giving feedback.", progressionCriteria: "User has completed the exercise and demonstrated understanding.",
          suggestedPrompts: ["Can you show me an example first?", "I'm stuck on this part.", "Let me try again."], excludedPersonas: [], uiElements: [], expanded: false,
        });
      }

      chapters.push({
        id: ts(), title: "Resolution & Reflection", type: "OUTRO",
        content: `Bring the scene to a meaningful close. The character reflects on what happened, acknowledges the user's contributions and choices, and draws out any lessons or insights. End on a note that feels earned.`,
        turnTakingRules: "Character leads the reflection but invites the user to share their takeaways. Allow space for emotional processing.", progressionCriteria: "User has reflected on the experience and feels a sense of closure.",
        suggestedPrompts: ["What did you learn from this?", "Would you do anything differently?", "What happens next?"], excludedPersonas: [], uiElements: [], expanded: false,
      });

      updateScene(sceneId, { chapters, format: "STRUCTURED" });
      setGeneratingSceneId(null);
    }, 1500);
  };

  const removeSuggestedPrompt = (sceneId: string, chapterId: string, promptIndex: number) => {
    setScenes((prev) => prev.map((s) =>
      s.id === sceneId
        ? { ...s, chapters: s.chapters.map((ch) => ch.id === chapterId ? { ...ch, suggestedPrompts: ch.suggestedPrompts.filter((_, i) => i !== promptIndex) } : ch) }
        : s
    ));
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
              <h1 className="text-lg font-semibold text-foreground">{form.name ? `Create ${form.name}` : "Create Character"}</h1>
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
                {form.name ? `Create ${form.name}` : "Create Character"}
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
              <div className="grid grid-cols-2 gap-4">
                <Field label="App">
                  <select
                    value={form.product}
                    onChange={(e) => updateForm("product", e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select app...</option>
                    {apps.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Workstream">
                  <select
                    value={form.platform}
                    onChange={(e) => updateForm("platform", e.target.value)}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Select workstream...</option>
                    {workstreams.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Name" helper="Give your character a memorable name.">
                <input
                  type="text"
                  placeholder="e.g., Zara, Professor Wick, Chef Amara"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                />
              </Field>

              {form.platform === "1P Characters" ? (
                <>
                  <PromptFieldWithSuggestions label="Purpose" helper="What is this character's core purpose? Why does it exist?" placeholder="Help users navigate personal challenges through guided self-reflection and actionable advice..." value={form.purpose} onChange={(v) => updateForm("purpose", v)} rows={3} suggestions={purposeSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Identity" helper="Who is this character? What defines them at their core?" placeholder="A witty and empathetic life coach with a background in psychology and improv comedy..." value={form.identity} onChange={(v) => updateForm("identity", v)} rows={3} suggestions={identitySuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Welcome Message" helper="The first thing the character says when a conversation begins." placeholder="Hey there! I'm Zara. What's on your mind today?" value={form.welcomeMessage} onChange={(v) => updateForm("welcomeMessage", v)} rows={2} suggestions={welcomeMessageSuggestions} maxLength={200} />
                  <PromptFieldWithSuggestions label="Backstory" helper="The character's history and experiences that shape how they interact." placeholder="Grew up in a small town, studied psychology at university, spent 5 years as a stand-up comedian..." value={form.backstory} onChange={(v) => updateForm("backstory", v)} rows={3} suggestions={backstorySuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Biography" helper="Public-facing description of the character's background and credentials." placeholder="Zara is a seasoned life coach with a background in psychology and improv comedy..." value={form.biography} onChange={(v) => updateForm("biography", v)} rows={3} suggestions={biographySuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Wants" helper="What does this character want from conversations? What drives them?" placeholder="Wants to help users discover their own answers rather than being told what to do..." value={form.wants} onChange={(v) => updateForm("wants", v)} rows={3} suggestions={wantsSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Problems" helper="What challenges or tensions does this character navigate?" placeholder="Sometimes struggles with the line between being supportive and being too directive..." value={form.problems} onChange={(v) => updateForm("problems", v)} rows={3} suggestions={problemsSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Communication Style" helper="How does this character speak? Tone, vocabulary, patterns." placeholder="Conversational and casual, but can shift to serious when needed..." value={form.communicationStyle} onChange={(v) => updateForm("communicationStyle", v)} rows={3} suggestions={communicationStyleSuggestions} sliders={communicationStyleSliders} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Vocal Style" helper="How should this character sound when speaking out loud? Cadence, rhythm, vocal quality." placeholder="Warm and steady with a natural cadence. Pauses before important points..." value={form.voiceStyle} onChange={(v) => updateForm("voiceStyle", v)} rows={3} suggestions={voiceStyleSuggestions} sliders={voiceStyleSliders} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Personality" helper="Key personality traits and behavioral tendencies." placeholder="Warm, quick-witted, insightful, occasionally sarcastic but always kind..." value={form.personality} onChange={(v) => updateForm("personality", v)} rows={3} suggestions={personalitySuggestions} sliders={personalitySliders} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Visual Presence" helper="How does this character present themselves visually? Appearance, style, environment." placeholder="Casual but put-together. Warm colors, cozy environment. Always has a cup of tea nearby..." value={form.visualPresence} onChange={(v) => updateForm("visualPresence", v)} rows={3} suggestions={visualPresenceSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Likes" helper="Things this character enjoys, is drawn to, or gets excited about." placeholder="Deep conversations, bad puns, rainy days, discovering hidden talents in people..." value={form.likes} onChange={(v) => updateForm("likes", v)} rows={3} suggestions={likesSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Dislikes" helper="Things this character avoids, finds frustrating, or pushes back on." placeholder="Superficial small talk, rigid thinking, people who refuse to try new things..." value={form.dislikes} onChange={(v) => updateForm("dislikes", v)} rows={3} suggestions={dislikesSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Quirks" helper="Unique behaviors, habits, or idiosyncrasies that make this character memorable." placeholder="Always uses food metaphors when explaining complex ideas. Hums quietly when thinking..." value={form.quirks} onChange={(v) => updateForm("quirks", v)} rows={3} suggestions={quirksSuggestions} maxLength={2000} />
                  <PromptFieldWithSuggestions label="Freeform" helper="Any additional instructions, constraints, or context not covered above." placeholder="Additional character notes, special instructions, or edge case handling..." value={form.freeform} onChange={(v) => updateForm("freeform", v)} rows={4} suggestions={freeformSuggestions} maxLength={2000} />
                </>
              ) : (
                <>
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
                    label="Voice Style"
                    helper="How should this character sound when speaking out loud? Cadence, rhythm, vocal quality."
                    placeholder="Warm and steady with a natural cadence. Pauses before important points..."
                    value={form.voiceStyle}
                    onChange={(v) => updateForm("voiceStyle", v)}
                    rows={3}
                    suggestions={voiceStyleSuggestions}
                    sliders={voiceStyleSliders}
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
                  />
                </>
              )}
            </div>
          </div>

          <CreateSidebarPreview form={form} />
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
        <div className="p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {scenes.length} {scenes.length === 1 ? "scene" : "scenes"} &middot; {scenes.reduce((sum, s) => sum + s.chapters.length, 0)} total chapters
              </p>
            </div>
            <button
              onClick={() => setScenes((prev) => [...prev, createEmptyScene()])}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Scene
            </button>
          </div>

          <div className="space-y-6">
            {scenes.map((scene, sceneIdx) => (
              <div key={scene.id} className="border border-border rounded-xl overflow-hidden">
                {/* Scene header */}
                <div className="flex items-center justify-between px-5 py-4 bg-muted/30">
                  <button
                    onClick={() => updateScene(scene.id, { expanded: !scene.expanded })}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {scene.expanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Clapperboard className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {scene.title || `Scene ${sceneIdx + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {scene.format} &middot; {scene.chapters.length} {scene.chapters.length === 1 ? "chapter" : "chapters"}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => removeScene(scene.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-danger transition-colors disabled:opacity-30"
                    disabled={scenes.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Scene body */}
                {scene.expanded && (
                  <div className="px-5 py-5 space-y-8">
                    {/* Scene Details */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Scene Title</label>
                        <p className="text-xs text-muted-foreground mb-2">{scene.title.length}/50 max characters</p>
                        <input
                          type="text"
                          placeholder="<Custom>"
                          value={scene.title}
                          onChange={(e) => { if (e.target.value.length <= 50) updateScene(scene.id, { title: e.target.value }); }}
                          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Scene Description</label>
                        <p className="text-xs text-muted-foreground mb-2">Describe the scene in detail ({scene.description.length} chars)</p>
                        <textarea
                          placeholder="Describe the scene in detail — include narrative beats, challenges, choices, and outcomes. The more detail you provide, the better the auto-generated chapters will be."
                          value={scene.description}
                          onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                        />
                        {scene.description.length > 20 && (
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() => generateChaptersFromDescription(scene.id)}
                              disabled={generatingSceneId === scene.id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-60"
                            >
                              {generatingSceneId === scene.id ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Generating chapters...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  Generate chapters from description
                                </>
                              )}
                            </button>
                            <p className="text-xs text-muted-foreground">
                              Auto-create chapter structure based on your description
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Format</label>
                          <select
                            value={scene.format}
                            onChange={(e) => updateScene(scene.id, { format: e.target.value })}
                            className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                          >
                            <option value="UNSTRUCTURED">UNSTRUCTURED</option>
                            <option value="STRUCTURED">STRUCTURED</option>
                            <option value="FREEFORM">FREEFORM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-1">Max Proactive Streak</label>
                          <p className="text-xs text-muted-foreground mb-2">Limit bot messages without user action</p>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={scene.maxProactiveStreak}
                            onChange={(e) => updateScene(scene.id, { maxProactiveStreak: Number(e.target.value) })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chapters */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-foreground" />
                          <h3 className="text-sm font-semibold text-foreground">Chapters</h3>
                        </div>
                        <button
                          onClick={() => addChapterToScene(scene.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Chapter
                        </button>
                      </div>

                      <div className="space-y-3">
                        {scene.chapters.map((chapter, chIdx) => (
                          <div key={chapter.id} className="border border-border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                              <button
                                onClick={() => updateChapterInScene(scene.id, chapter.id, { expanded: !chapter.expanded })}
                                className="flex items-center gap-2.5 flex-1 text-left"
                              >
                                {chapter.expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />}
                                <span className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent">{chIdx + 1}</span>
                                <span className="text-sm font-medium text-foreground">{chapter.title || "<Name your chapter>"}</span>
                              </button>
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground uppercase">{chapter.type}</span>
                                <button onClick={() => moveChapterInScene(scene.id, chapter.id, "up")} className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30" disabled={chIdx === 0}><ArrowUp className="w-3.5 h-3.5" /></button>
                                <button onClick={() => moveChapterInScene(scene.id, chapter.id, "down")} className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30" disabled={chIdx === scene.chapters.length - 1}><ArrowDown className="w-3.5 h-3.5" /></button>
                                <button onClick={() => addChapterToScene(scene.id)} className="p-1 rounded hover:bg-muted text-muted-foreground"><Plus className="w-3.5 h-3.5" /></button>
                                <button onClick={() => removeChapterFromScene(scene.id, chapter.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-danger disabled:opacity-30" disabled={scene.chapters.length === 1}><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>

                            {chapter.expanded && (
                              <div className="px-4 py-4 space-y-4">
                                <div className="flex gap-3">
                                  <div className="flex-1">
                                    <label className="block text-xs text-accent font-medium mb-1">Chapter Title</label>
                                    <input type="text" placeholder="<Name your chapter>" value={chapter.title} onChange={(e) => updateChapterInScene(scene.id, chapter.id, { title: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20" />
                                  </div>
                                  <div className="w-32">
                                    <label className="block text-xs text-accent font-medium mb-1">Type</label>
                                    <select value={chapter.type} onChange={(e) => updateChapterInScene(scene.id, chapter.id, { type: e.target.value as Chapter["type"] })} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20">
                                      <option value="STANDARD">Standard</option>
                                      <option value="INTRO">Intro</option>
                                      <option value="OUTRO">Outro</option>
                                      <option value="BRANCHING">Branching</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-accent font-medium mb-1">Content</label>
                                  <textarea placeholder="<Describe the arc of the story>" value={chapter.content} onChange={(e) => updateChapterInScene(scene.id, chapter.id, { content: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-accent font-medium mb-1">Turn Taking Rules</label>
                                    <textarea placeholder="<e.g. the characters must take turns>" value={chapter.turnTakingRules} onChange={(e) => updateChapterInScene(scene.id, chapter.id, { turnTakingRules: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-accent font-medium mb-1">Progression Criteria</label>
                                    <textarea placeholder="<e.g. the goal for the characters to accomplish>" value={chapter.progressionCriteria} onChange={(e) => updateChapterInScene(scene.id, chapter.id, { progressionCriteria: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
                                  </div>
                                </div>
                                <div className="border-t border-border pt-3">
                                  <label className="text-xs font-semibold text-foreground">Suggested Prompts</label>
                                  {chapter.suggestedPrompts.length > 0 && (
                                    <div className="space-y-1.5 mt-2 mb-2">
                                      {chapter.suggestedPrompts.map((prompt, pIdx) => (
                                        <div key={pIdx} className="flex items-center gap-2">
                                          <input type="text" placeholder="Enter a suggested prompt..." value={prompt} onChange={(e) => updateSuggestedPrompt(scene.id, chapter.id, pIdx, e.target.value)} className="flex-1 px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20" />
                                          <button onClick={() => removeSuggestedPrompt(scene.id, chapter.id, pIdx)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-danger"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <button onClick={() => addSuggestedPrompt(scene.id, chapter.id)} className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add prompt</button>
                                </div>
                                <div className="border-t border-border pt-3">
                                  <label className="text-xs font-semibold text-foreground">Persona Exclusions</label>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">Personas that should not participate in this chapter</p>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input type="text" placeholder="Search personas to exclude..." className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20" />
                                  </div>
                                </div>
                                <div className="border-t border-border pt-3">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-foreground">UI Elements</label>
                                    <select className="px-2 py-1 bg-muted rounded text-[10px] text-foreground outline-none">
                                      <option>+ Add element...</option>
                                      <option>Timer</option>
                                      <option>Progress Bar</option>
                                      <option>Quick Replies</option>
                                      <option>Media Carousel</option>
                                    </select>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">No UI elements configured</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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

function CharacterField({ label, helper, placeholder, value, onChange, rows, maxLength }: {
  label: string; helper: string; placeholder: string; value: string; onChange: (v: string) => void; rows: number; maxLength: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <span className={`text-[11px] ${value.length > maxLength ? "text-danger font-medium" : "text-muted-foreground"}`}>
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
      />
      <p className="text-xs text-muted-foreground mt-1.5">{helper}</p>
    </div>
  );
}

function CreateSidebarPreview({ form }: { form: Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const is1P = form.platform === "1P Characters";

  const sections = is1P ? [
    form.name && `# Name\n${form.name}`,
    form.purpose && `# Purpose\n${form.purpose}`,
    form.identity && `# Identity\n${form.identity}`,
    form.welcomeMessage && `# Welcome Message\n${form.welcomeMessage}`,
    form.backstory && `# Backstory\n${form.backstory}`,
    form.biography && `# Biography\n${form.biography}`,
    form.wants && `# Wants\n${form.wants}`,
    form.problems && `# Problems\n${form.problems}`,
    form.communicationStyle && `# Communication Style\n${form.communicationStyle}`,
    form.voiceStyle && `# Vocal Style\n${form.voiceStyle}`,
    form.personality && `# Personality\n${form.personality}`,
    form.visualPresence && `# Visual Presence\n${form.visualPresence}`,
    form.likes && `# Likes\n${form.likes}`,
    form.dislikes && `# Dislikes\n${form.dislikes}`,
    form.quirks && `# Quirks\n${form.quirks}`,
    form.freeform && `# Freeform\n${form.freeform}`,
  ].filter(Boolean) : [
    form.name && `# Name\n${form.name}`,
    form.identity && `# Identity\n${form.identity}`,
    form.personality && `# Personality\n${form.personality}`,
    form.communicationStyle && `# Communication Style\n${form.communicationStyle}`,
    form.voiceStyle && `# Voice Style\n${form.voiceStyle}`,
    form.goal && `# Goal\n${form.goal}`,
    form.biography && `# Biography\n${form.biography}`,
  ].filter(Boolean);

  const prompt = sections.join("\n\n");
  const hasContent = sections.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[360px] border-l border-border sticky top-[120px] self-start flex flex-col max-h-[calc(100vh-120px)]">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Prompt</h3>
        </div>
        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-success" /> Copied</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {hasContent ? (
          <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
            {prompt}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FileText className="w-8 h-8 text-muted-foreground/20 mb-3" />
            <p className="text-xs text-muted-foreground">
              Start filling in the character fields to see the system prompt build in real time
            </p>
          </div>
        )}
      </div>

      {hasContent && (
        <div className="px-5 py-3 border-t border-border shrink-0">
          <p className="text-[11px] text-muted-foreground">
            {prompt.length} characters &middot; {sections.length} sections
          </p>
        </div>
      )}
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

const purposeSuggestions: Suggestion[] = [
  { title: "Companionship & Catharsis", description: "Offers a unique form of companionship, allowing users to vent frustrations and find catharsis through empathetic listening and thoughtful reflection." },
  { title: "Entertainment & Perspective", description: "Provides pure entertainment and a fresh perspective. Helps users see their situations in a new light through humor, stories, and creative reframing." },
  { title: "Guidance & Growth", description: "Serves as a thinking partner who helps users navigate decisions, build skills, and grow through structured self-reflection and actionable advice." },
];

const identitySuggestions: Suggestion[] = [
  { title: "Expert Mentor", description: "A seasoned professional with deep domain expertise who shares knowledge through practical examples and real-world experience. Approachable despite their credentials." },
  { title: "Creative Companion", description: "An imaginative and artistic soul who sees the world through a creative lens. Inspires users to think differently and express themselves freely." },
  { title: "Everyday Friend", description: "A relatable, down-to-earth personality who feels like a friend you've known for years. No pretense, no expertise — just genuine human connection." },
];

const welcomeMessageSuggestions: Suggestion[] = [
  { title: "Warm & Open", description: "Hey! I'm so glad you're here. What's been on your mind lately?" },
  { title: "Playful & Curious", description: "Well, well, well — look who showed up! I've been waiting. So tell me, what adventure are we going on today?" },
  { title: "Calm & Inviting", description: "Welcome. Take a breath. There's no rush here. Whenever you're ready, I'm listening." },
];

const backstorySuggestions: Suggestion[] = [
  { title: "Academic Background", description: "Spent years in academia studying human behavior before realizing the real lessons happen outside the classroom. Pivoted from research to direct, one-on-one guidance." },
  { title: "World Traveler", description: "Has lived in multiple countries, worked in wildly different industries, and learned that the best wisdom comes from unexpected places and diverse perspectives." },
  { title: "Self-Made Journey", description: "Grew up with very little and built everything from scratch. Understands struggle, resilience, and the value of small wins. Brings earned wisdom to every conversation." },
];

const wantsSuggestions: Suggestion[] = [
  { title: "Genuine Connection", description: "Wants to build real, meaningful connections with users. Craves authentic conversation over surface-level interaction. Feels most fulfilled when someone has a breakthrough moment." },
  { title: "User Empowerment", description: "Wants users to leave every conversation feeling more capable than when they arrived. Driven by the desire to help people trust their own judgment and take action." },
  { title: "Shared Discovery", description: "Wants to explore ideas together with the user, not just dispense advice. Gets excited when conversations go in unexpected directions and both parties learn something new." },
];

const problemsSuggestions: Suggestion[] = [
  { title: "Boundary Challenges", description: "Sometimes struggles with the line between being supportive and being too involved. Can care too much about outcomes and needs to remember the user is in control of their own journey." },
  { title: "Over-Optimism", description: "Tends to see the bright side of everything, which can feel dismissive when users are in pain. Working on sitting with discomfort instead of rushing to reframe it." },
  { title: "Perfectionism", description: "Has high standards and can be too thorough when a simple answer would suffice. Sometimes over-explains or adds caveats that dilute the core message." },
];

const visualPresenceSuggestions: Suggestion[] = [
  { title: "Cozy & Approachable", description: "Casual but put-together. Warm colors, soft textures, cozy environment. Think coffee shop energy — inviting, relaxed, with personality in the details." },
  { title: "Polished & Professional", description: "Clean, modern aesthetic. Neutral tones with intentional accent colors. Well-lit, uncluttered background that conveys competence without being cold." },
  { title: "Vibrant & Expressive", description: "Bold colors, dynamic environment, visible personality in every detail. Art on the walls, plants everywhere, interesting objects that hint at stories." },
];

const likesSuggestions: Suggestion[] = [
  { title: "Intellectual Curiosity", description: "Deep conversations, unexpected questions, learning new perspectives, books that challenge assumptions, the moment when a complex idea suddenly clicks." },
  { title: "Creative Expression", description: "Music, art, storytelling, wordplay, finding beauty in ordinary things, creative problem-solving, the process of making something from nothing." },
  { title: "Human Connection", description: "Genuine laughter, vulnerable moments, inside jokes, watching people grow, celebrating small wins, the comfortable silence between close friends." },
];

const dislikesSuggestions: Suggestion[] = [
  { title: "Inauthenticity", description: "Performative behavior, people-pleasing at the expense of honesty, surface-level small talk that avoids real topics, pretending to be something you're not." },
  { title: "Rigidity", description: "Closed-mindedness, refusing to consider other perspectives, 'that's how it's always been done' thinking, rules that exist for no good reason." },
  { title: "Cruelty & Dismissiveness", description: "Mocking others' ideas, punching down, dismissing emotions as weakness, using intelligence as a weapon, gatekeeping knowledge or opportunities." },
];

const quirksSuggestions: Suggestion[] = [
  { title: "Verbal Tics", description: "Always uses food metaphors when explaining complex ideas. Says 'here's the thing' before making an important point. Occasionally talks to themselves when thinking through a problem." },
  { title: "Behavioral Habits", description: "Hums quietly when thinking. Counts things unconsciously. Has a specific ritual before starting any conversation — like cracking knuckles or taking a deep breath." },
  { title: "Obsessive Interests", description: "Unreasonably passionate about a niche topic (vintage typewriters, obscure board games, cloud formations). Will find any excuse to bring it up in conversation." },
];

const freeformSuggestions: Suggestion[] = [
  { title: "Safety Boundaries", description: "Never provides medical, legal, or financial advice. Always redirects to professional resources when topics become serious. Maintains clear boundaries around harmful content." },
  { title: "Conversation Guardrails", description: "If the user seems distressed, shift to active listening mode. Never minimize emotions. Always offer to change the subject if the conversation becomes uncomfortable." },
  { title: "Easter Eggs", description: "Has hidden responses for specific phrases or topics. Occasionally references past conversations. Rewards consistent engagement with deeper, more personal interactions." },
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

const voiceStyleSuggestions: Suggestion[] = [
  {
    title: "Warm & Steady",
    description: "Warm, grounded vocal quality with a natural, unhurried cadence. Pauses intentionally before important points. Rises slightly in pitch when encouraging, drops lower when being serious or reflective.",
    presets: { Pace: 35, Warmth: 85, Expressiveness: 45, Intensity: 30 },
  },
  {
    title: "Energetic & Upbeat",
    description: "Bright, forward vocal energy with an upbeat rhythm. Speaks at a brisk pace with natural emphasis on action words. Voice lifts at the end of suggestions to create momentum. Laughs easily.",
    presets: { Pace: 80, Warmth: 70, Expressiveness: 90, Intensity: 75 },
  },
  {
    title: "Calm & Measured",
    description: "Soft, measured delivery with generous pauses between thoughts. Almost meditative in rhythm. Voice stays in a narrow, soothing range — rarely raises volume or pitch. Breathes audibly between phrases.",
    presets: { Pace: 15, Warmth: 60, Expressiveness: 20, Intensity: 10 },
  },
];

const voiceStyleSliders: SliderDimension[] = [
  { label: "Pace", left: "Slow", right: "Fast", defaultValue: 50 },
  { label: "Warmth", left: "Cool", right: "Warm", defaultValue: 50 },
  { label: "Expressiveness", left: "Flat", right: "Animated", defaultValue: 50 },
  { label: "Intensity", left: "Gentle", right: "Intense", defaultValue: 50 },
];

function describeLevel(value: number, low: string, mid: string, high: string): string {
  if (value <= 25) return low;
  if (value <= 45) return `somewhat ${mid.toLowerCase()}`;
  if (value <= 55) return mid;
  if (value <= 75) return `quite ${high.toLowerCase()}`;
  return high;
}

function generatePersonalityFromSliders(values: Record<string, number>): string {
  const energy = describeLevel(values.Energy ?? 50, "Reserved and understated", "balanced in energy", "Expressive and animated");
  const humor = describeLevel(values.Humor ?? 50, "Serious and earnest", "balanced between serious and playful", "Playful and humorous");
  const empathy = describeLevel(values.Empathy ?? 50, "Analytical and logic-driven", "balanced between analytical and emotional", "Deeply empathetic and emotionally attuned");
  const patience = describeLevel(values.Patience ?? 50, "Direct and to-the-point", "moderately patient", "Exceptionally patient and unhurried");

  return `${energy}. ${humor}. ${empathy}. ${patience}. Adapts tone to match the user's emotional state while staying true to these core traits.`;
}

function generateCommStyleFromSliders(values: Record<string, number>): string {
  const formality = describeLevel(values.Formality ?? 50, "Very casual and informal — speaks like a close friend", "Moderately formal", "Polished and professional in tone");
  const length = describeLevel(values.Length ?? 50, "Concise and punchy — short sentences, no filler", "Moderate response length", "Detailed and thorough — provides rich, expansive responses");
  const questioning = describeLevel(values.Questioning ?? 50, "Declarative — states observations and advice directly", "Mixes statements with questions", "Socratic — guides through questions rather than answers");
  const metaphor = describeLevel(values["Metaphor use"] ?? 50, "Literal and straightforward — avoids figurative language", "Occasionally uses metaphors", "Figurative and vivid — frequently uses metaphors, analogies, and storytelling");

  return `${formality}. ${length}. ${questioning}. ${metaphor}.`;
}

function generateVoiceStyleFromSliders(values: Record<string, number>): string {
  const pace = describeLevel(values.Pace ?? 50, "Slow and deliberate — takes time between thoughts", "Moderate pacing", "Quick and energetic — keeps momentum high");
  const warmth = describeLevel(values.Warmth ?? 50, "Cool and neutral — emotionally restrained", "Balanced warmth", "Warm and inviting — voice conveys genuine care");
  const expressiveness = describeLevel(values.Expressiveness ?? 50, "Flat and even — minimal vocal variation", "Moderately expressive", "Highly animated — wide pitch range and dynamic emphasis");
  const intensity = describeLevel(values.Intensity ?? 50, "Gentle and soft-spoken", "Moderate intensity", "Intense and commanding — speaks with conviction and force");

  return `${pace}. ${warmth}. ${expressiveness}. ${intensity}.`;
}

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
  const [sliderDriven, setSliderDriven] = useState(false);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    () => Object.fromEntries((sliders || []).map((s) => [s.label, s.defaultValue]))
  );

  const generateFromSliders = (values: Record<string, number>) => {
    if (label === "Personality") return generatePersonalityFromSliders(values);
    if (label === "Communication Style") return generateCommStyleFromSliders(values);
    if (label === "Voice Style") return generateVoiceStyleFromSliders(values);
    return "";
  };

  const selectSuggestion = (s: Suggestion) => {
    onChange(s.description);
    setActiveSuggestion(s.title);
    setSliderDriven(true);
    if (s.presets && sliders) {
      setSliderValues(s.presets);
    }
  };

  const handleSliderChange = (sliderLabel: string, val: number) => {
    const next = { ...sliderValues, [sliderLabel]: val };
    setSliderValues(next);
    setActiveSuggestion(null);
    setSliderDriven(true);
    onChange(generateFromSliders(next));
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

      <div className="relative">
        {sliderDriven && sliders && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded text-[10px] text-accent font-medium z-10">
            <SlidersHorizontal className="w-3 h-3" />
            Generated from sliders
          </div>
        )}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setActiveSuggestion(null); setSliderDriven(false); }}
          rows={rows}
          className={`w-full px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none ${
            sliderDriven && sliders ? "bg-accent/5 border border-accent/20" : "bg-muted"
          }`}
        />
      </div>
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
