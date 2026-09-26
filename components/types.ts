export type Tab = "home" | "tasks" | "league" | "news" | "profile" | "lab" | "snippets" | "shop";

export type OctoMood = "idle" | "happy" | "sad" | "thinking";

export type LessonId =
  | "prompt-builder-2"
  | "prompt-duel-1"
  | "prompt-duel-2"
  | "code-fix-1"
  | "code-fix-2"
  | "brief-to-prompt-1"
  | "brief-to-prompt-2"
  | "boss-duel"
  | "boss-brief";

export type LessonKind = "prompt-builder" | "prompt-duel" | "code-fix" | "brief-to-prompt";

export type LessonResult = { correct: boolean; xp: number; prompt?: string };
