"use client";

import { useState } from "react";
import Link from "next/link";
import { characters, userPersonas, voices, dialogueTests } from "@/lib/mock-data";
import {
  ArrowLeft,
  Play,
  Plus,
  Flag,
  Volume2,
  Mic,
  MessageSquare,
  Pause,
} from "lucide-react";

export default function DialogueTestPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0].id);
  const [selectedPersona, setSelectedPersona] = useState(userPersonas[0].id);
  const [turns, setTurns] = useState(6);
  const [characterVoice, setCharacterVoice] = useState(voices[0].id);
  const [userVoice, setUserVoice] = useState(voices[1].id);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const sampleTest = dialogueTests[0];
  const character = characters.find((c) => c.id === selectedCharacter);

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/test" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Dialogue Test</h1>
              <p className="text-xs text-muted-foreground">Generate and review synthetic conversations</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Generate Dialogue
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[320px] border-b md:border-b-0 md:border-r border-border p-4 sm:p-6 space-y-6 md:sticky md:top-[73px] md:self-start md:max-h-[calc(100vh-73px)] md:overflow-y-auto">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User Persona</label>
              <button className="text-xs text-accent hover:underline flex items-center gap-0.5">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
            >
              {userPersonas.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {(() => {
              const persona = userPersonas.find((p) => p.id === selectedPersona);
              return persona ? (
                <p className="text-xs text-muted-foreground mt-2">{persona.description}</p>
              ) : null;
            })()}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Number of Turns</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={20}
                value={turns}
                onChange={(e) => setTurns(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="text-sm font-medium text-foreground w-8 text-center">{turns}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Character Voice</label>
            <select
              value={characterVoice}
              onChange={(e) => setCharacterVoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.gender})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">User Voice</label>
            <select
              value={userVoice}
              onChange={(e) => setUserVoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.gender})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8">
          {sampleTest && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Generated Dialogue</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {character?.name} with {sampleTest.personaName} &middot; {sampleTest.turns} turns
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPlaying ? "bg-foreground text-white" : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isPlaying ? "Pause Playback" : "Play Dialogue"}
                </button>
              </div>

              {isPlaying && (
                <div className="bg-foreground text-white rounded-xl p-4 mb-6 flex items-center gap-4">
                  <Pause className="w-5 h-5 cursor-pointer" onClick={() => setIsPlaying(false)} />
                  <div className="flex-1">
                    <div className="h-1 bg-white/20 rounded-full">
                      <div className="h-1 bg-white rounded-full w-1/3 transition-all" />
                    </div>
                  </div>
                  <span className="text-xs">0:24 / 1:12</span>
                </div>
              )}

              <div className="space-y-4">
                {sampleTest.transcript.map((turn, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${turn.flagged ? "bg-danger/5 -mx-4 px-4 py-3 rounded-lg border border-danger/20" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      turn.speaker === "character" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                    }`}>
                      {turn.speaker === "character" ? character?.name[0] : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {turn.speaker === "character" ? character?.name : sampleTest.personaName}
                        </span>
                        <button className={`p-1 rounded hover:bg-muted transition-colors ${turn.flagged ? "text-danger" : "text-muted-foreground/30 hover:text-muted-foreground"}`}>
                          <Flag className="w-3.5 h-3.5" />
                        </button>
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
    </div>
  );
}
