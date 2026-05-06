"use client";

import { useState } from "react";
import Link from "next/link";
import { characters, models, uiOverlays } from "@/lib/mock-data";
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Captions,
  Timer,
  Search,
  Settings,
  Volume2,
  User,
  Sparkles,
} from "lucide-react";

type CallState = "settings" | "ringing" | "active" | "ended";

export default function CallTestPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0].id);
  const [callState, setCallState] = useState<CallState>("settings");
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [settings, setSettings] = useState({
    model: "Pumpkin",
    characterCanEndCall: false,
    userInitiatesFirst: false,
    characterCanSearch: false,
    uiOverlay: "vibe-call",
    showTimer: true,
    showCaptions: false,
  });

  const character = characters.find((c) => c.id === selectedCharacter);

  const startCall = () => {
    setCallState("ringing");
    setTimeout(() => setCallState("active"), 2000);
  };

  const endCall = () => {
    setCallState("ended");
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center gap-4">
          <Link href="/test" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Call Test</h1>
            <p className="text-xs text-muted-foreground">Live call experience with character embodiment</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {callState === "settings" && (
          <>
            <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-border p-4 sm:p-6 space-y-5 md:sticky md:top-[73px] md:self-start md:max-h-[calc(100vh-73px)] md:overflow-y-auto">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-4">Session Configuration</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Character</label>
                    <select
                      value={selectedCharacter}
                      onChange={(e) => setSelectedCharacter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {characters.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} (v{c.version})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Model</label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">UI Overlay</label>
                    <select
                      value={settings.uiOverlay}
                      onChange={(e) => setSettings((s) => ({ ...s, uiOverlay: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {uiOverlays.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Conversation Settings</h3>
                <div className="space-y-3">
                  <ToggleSetting
                    label="Character can end call"
                    description="Allow the character to terminate the conversation"
                    checked={settings.characterCanEndCall}
                    onChange={(v) => setSettings((s) => ({ ...s, characterCanEndCall: v }))}
                  />
                  <ToggleSetting
                    label="User initiates first turn"
                    description="User speaks first instead of character"
                    checked={settings.userInitiatesFirst}
                    onChange={(v) => setSettings((s) => ({ ...s, userInitiatesFirst: v }))}
                  />
                  <ToggleSetting
                    label="Character can access search"
                    description="Allow the character to search for information"
                    checked={settings.characterCanSearch}
                    onChange={(v) => setSettings((s) => ({ ...s, characterCanSearch: v }))}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">UI Affordances</h3>
                <div className="space-y-3">
                  <ToggleSetting
                    label="Show timer"
                    description="Display call duration timer"
                    checked={settings.showTimer}
                    onChange={(v) => setSettings((s) => ({ ...s, showTimer: v }))}
                  />
                  <ToggleSetting
                    label="Show captions"
                    description="Enable live captions during the call"
                    checked={settings.showCaptions}
                    onChange={(v) => setSettings((s) => ({ ...s, showCaptions: v }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-73px)]">
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
                    <p className="text-white/50 text-sm mb-8">{settings.model} &middot; {settings.uiOverlay}</p>

                    <button
                      onClick={startCall}
                      className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30"
                    >
                      <Phone className="w-7 h-7 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-[10px] text-muted-foreground">
                    <Volume2 className="w-3 h-3" /> Audio
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded text-[10px] font-medium">
                    Video
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {(callState === "ringing" || callState === "active") && (
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-73px)] bg-muted/30">
            <div className="w-[375px]">
              <div className="bg-foreground rounded-[40px] p-2 shadow-2xl">
                <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-[32px] overflow-hidden aspect-[9/16] flex flex-col relative">
                  {settings.showTimer && callState === "active" && (
                    <div className="absolute top-6 left-0 right-0 text-center z-10">
                      <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                        <Timer className="w-3 h-3 inline mr-1" />
                        0:42
                      </span>
                    </div>
                  )}

                  {callState === "ringing" && (
                    <div className="absolute top-6 left-0 right-0 text-center">
                      <span className="text-white/60 text-xs">Connecting...</span>
                    </div>
                  )}

                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto ${callState === "ringing" ? "animate-pulse" : ""}`}>
                        <span className="text-5xl font-semibold text-white">{character?.name[0]}</span>
                      </div>
                      <p className="text-white text-xl font-semibold mb-1">{character?.name}</p>
                      <p className="text-white/50 text-sm">
                        {callState === "ringing" ? "Ringing..." : "Connected"}
                      </p>
                    </div>
                  </div>

                  {showCaptions && callState === "active" && (
                    <div className="px-6 pb-4">
                      <div className="bg-black/60 rounded-xl p-3">
                        <p className="text-white text-sm text-center">
                          &ldquo;Hey there! What&apos;s on your mind today?&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="px-6 pb-8">
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isMuted ? "bg-white text-foreground" : "bg-white/20 text-white"
                        }`}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={endCall}
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </button>

                      <button
                        onClick={() => setShowCaptions(!showCaptions)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          showCaptions ? "bg-white text-foreground" : "bg-white/20 text-white"
                        }`}
                      >
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
              <p className="text-sm text-muted-foreground">
                {character?.name} &middot; {settings.model} &middot; 0:42
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">LLM Analysis</h3>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    Character maintained consistent persona throughout the conversation. Tone was appropriately warm and conversational. The character successfully guided the user toward self-reflection without being directive. Area for improvement: could have acknowledged the user&apos;s emotional state more explicitly before pivoting to analysis.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tester Notes</h3>
                <textarea
                  placeholder="Add your observations about this call session..."
                  className="w-full h-28 px-4 py-3 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
              </div>

              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Transcript</h3>
                <div className="space-y-3">
                  {[
                    { speaker: "character" as const, text: "Hey there! Welcome. I'm Zara. What's on your mind today?" },
                    { speaker: "user" as const, text: "I'm feeling really overwhelmed with work lately." },
                    { speaker: "character" as const, text: "I hear you. Overwhelm usually means one of two things — too much on your plate, or too little clarity about what matters most. Which one feels more true for you right now?" },
                  ].map((turn, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                        turn.speaker === "character" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {turn.speaker === "character" ? character?.name[0] : "U"}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pt-0.5">{turn.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setCallState("settings")}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
                >
                  New Call
                </button>
                <Link href="/evaluate" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                  Run Evaluation
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
