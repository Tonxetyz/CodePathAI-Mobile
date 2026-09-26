import type { LessonId } from "../types";

export type WorldNode = { id: LessonId; title: string; xp: number; boss?: boolean };
export type WorldModuleData = { id: string; title: string; subtitle: string; nodes: WorldNode[] };

export const WORLD_MODULES: WorldModuleData[] = [
  {
    id: "dialogue-city",
    title: "ГОРОД ДИАЛОГОВ",
    subtitle: "промпт-дуэли и разбор кода · модуль 3",
    nodes: [
      { id: "prompt-builder-2", title: "Продвинутый конструктор", xp: 25 },
      { id: "prompt-duel-1", title: "Промпт-дуэль", xp: 30 },
      { id: "code-fix-1", title: "Почини баг", xp: 30 },
      { id: "boss-duel", title: "Босс: Дуэль промптов", xp: 50, boss: true },
    ],
  },
  {
    id: "client-archive",
    title: "АРХИВ КЛИЕНТОВ",
    subtitle: "из брифа в промпт · модуль 4",
    nodes: [
      { id: "brief-to-prompt-1", title: "Бриф клиента №1", xp: 30 },
      { id: "prompt-duel-2", title: "Промпт-дуэль II", xp: 30 },
      { id: "code-fix-2", title: "Почини баг II", xp: 30 },
      { id: "boss-brief", title: "Босс: Сложный бриф", xp: 60, boss: true },
    ],
  },
];
