export interface Character {
  id: string;
  name: string;
  identity: string;
  personality: string;
  communicationStyle: string;
  goal: string;
  biography: string;
  voiceId: string;
  voiceName: string;
  characterImage: string | null;
  scene: string | null;
  createdBy: string;
  version: number;
  status: "draft" | "published";
  clonedFrom?: string;
  versions: CharacterVersion[];
  configurations: CharacterConfiguration[];
  scenes: CharacterScene[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterScene {
  id: string;
  title: string;
  description: string;
  format: string;
  maxProactiveStreak: number;
  chapters: SceneChapter[];
}

export interface SceneChapter {
  id: string;
  title: string;
  type: "STANDARD" | "INTRO" | "OUTRO" | "BRANCHING";
  content: string;
}

export interface CharacterVersion {
  version: number;
  createdBy: string;
  createdAt: string;
  summary: string;
  status: "draft" | "published";
}

export interface CharacterConfiguration {
  id: string;
  product: string;
  platform: string;
  promptConstraints: string;
  uiOverlay: string;
  rubricSetId: string | null;
}

export interface Voice {
  id: string;
  name: string;
  gender: string;
  accent: string;
  preview: string;
}

export interface UserPersona {
  id: string;
  name: string;
  description: string;
  behavior: string;
  createdBy: string;
}

export interface DialogueTest {
  id: string;
  characterId: string;
  personaId: string;
  personaName: string;
  turns: number;
  transcript: DialogueTurn[];
  characterVoice: string;
  userVoice: string;
  createdAt: string;
}

export interface DialogueTurn {
  speaker: "character" | "user";
  text: string;
  flagged?: boolean;
}

export interface CallTestSession {
  id: string;
  characterId: string;
  configurationId: string;
  model: string;
  settings: CallSettings;
  transcript: DialogueTurn[];
  llmAnalysis: string;
  testerNotes: string;
  duration: number;
  createdAt: string;
}

export interface CallSettings {
  model: string;
  characterCanEndCall: boolean;
  userInitiatesFirst: boolean;
  characterCanSearch: boolean;
  uiOverlay: string;
  showTimer: boolean;
  showCaptions: boolean;
}

export interface Rubric {
  id: string;
  name: string;
  project: string;
  platform: string;
  criteria: RubricCriterion[];
  version: number;
  createdBy: string;
  createdAt: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface EvalRun {
  id: string;
  characterId: string;
  characterName: string;
  rubricId: string;
  rubricName: string;
  version: number;
  status: "pending" | "in_progress" | "complete";
  llmScores: Record<string, number>;
  humanScores: Record<string, number | null>;
  assignedReviewer: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface GoldenSet {
  id: string;
  name: string;
  project: string;
  conversations: GoldenConversation[];
  createdBy: string;
  createdAt: string;
}

export interface GoldenConversation {
  id: string;
  turns: DialogueTurn[];
  notes: string;
}

export interface VersionComparison {
  characterId: string;
  versionA: number;
  versionB: number;
  rubricId: string;
  scoresA: Record<string, number>;
  scoresB: Record<string, number>;
}
