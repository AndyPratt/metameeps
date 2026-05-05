"use client";

import { useState } from "react";
import { userPersonas } from "@/lib/mock-data";
import {
  Plus,
  UserCircle,
  User,
  Edit3,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface PersonaForm {
  name: string;
  description: string;
  behavior: string;
}

const emptyForm: PersonaForm = { name: "", description: "", behavior: "" };

export default function PersonasPage() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState<PersonaForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PersonaForm>(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(userPersonas[0]?.id || null);

  const startEditing = (persona: typeof userPersonas[number]) => {
    setEditingId(persona.id);
    setEditForm({ name: persona.name, description: persona.description, behavior: persona.behavior });
    setExpandedId(persona.id);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Personas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reusable user personas for dialogue testing. Shared across all characters and the team.
          </p>
        </div>
        <button
          onClick={() => { setShowNewForm(true); setEditingId(null); }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Persona
        </button>
      </div>

      {showNewForm && (
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
                placeholder="How does this persona behave in conversation? e.g., 'Long responses, multiple questions per turn, expresses excitement'"
                value={newForm.behavior}
                onChange={(e) => setNewForm((f) => ({ ...f, behavior: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20 resize-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => { setShowNewForm(false); setNewForm(emptyForm); }}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Create Persona
            </button>
            <button
              onClick={() => { setShowNewForm(false); setNewForm(emptyForm); }}
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
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
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-lg transition-colors">
                      <MessageSquare className="w-3 h-3" />
                      Use in dialogue test
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-danger hover:bg-muted rounded-lg transition-colors ml-auto">
                      <Trash2 className="w-3 h-3" />
                      Delete
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
                      onClick={cancelEditing}
                      className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
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
    </div>
  );
}
