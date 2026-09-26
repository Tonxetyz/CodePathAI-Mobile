import { type ReactElement, useState } from "react";
import { Text, View } from "react-native";
import type { LessonResult, OctoMood } from "../types";
import { LessonChrome } from "./LessonChrome";
import { PromptSlotBuilder, type BankChip } from "./PromptSlotBuilder";

const BANK: BankChip[] = [
  { id: "role", label: "senior Python-разработчик", category: "role" },
  { id: "input", label: "URL страницы товара конкурента", category: "input" },
  { id: "task", label: "написать функцию, которая возвращает текущую цену", category: "task" },
  { id: "constraints", label: "обработать timeout и HTTP-ошибки, без внешних API-ключей", category: "constraints" },
  { id: "format", label: "готовая функция на Python с докстрокой, без пояснений", category: "format" },
  { id: "d1", label: "сделай красиво", category: "distractor" },
  { id: "d2", label: "как в лучших компаниях", category: "distractor" },
  { id: "d3", label: "не важно как, главное быстро", category: "distractor" },
];

export function PromptBuilderLesson({ onExit, onComplete }: { onExit: () => void; onComplete: (result: LessonResult) => void }): ReactElement {
  const [mood, setMood] = useState<OctoMood>("idle");
  const [caption, setCaption] = useState<string | undefined>(undefined);
  const [celebrate, setCelebrate] = useState(0);
  const [sound, setSound] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  function wrongPick() {
    setMood("sad");
    setCaption("Это не кирпичик промпта — просто пожелание без конкретики. Поищи вариант с деталями.");
    setSound((n) => n + 1);
  }
  function correctPick() {
    setMood("thinking");
    setCaption(undefined);
  }
  function assembled(prompt: string) {
    setDone(prompt);
    setMood("happy");
    setCaption("Отлично! Все пять блоков на месте — такой промпт не оставляет AI простора для догадок.");
    setCelebrate((n) => n + 1);
    setSound((n) => n + 1);
  }

  return (
    <LessonChrome
      eyebrow="ПРАКТИКА · КОНСТРУКТОР"
      title="Собери промпт из блоков"
      onExit={onExit}
      mood={mood}
      caption={caption}
      celebrateTrigger={celebrate}
      soundTrigger={sound}
      complete={done ? { xp: 25 } : undefined}
      onContinue={() => onComplete({ correct: true, xp: 25, prompt: done ?? undefined })}
    >
      <Text style={{ color: "#9CA9C4", fontSize: 13, lineHeight: 19 }}>
        Задача: нужен парсер цен с сайта конкурента. Выбери по одному кирпичику под каждый из пяти блоков — роль, данные, задачу, ограничения и формат. Среди кирпичиков есть пустые пожелания без деталей — они не подходят.
      </Text>
      <View style={{ marginTop: 16 }}>
        <PromptSlotBuilder bank={BANK} onWrongPick={wrongPick} onCorrectPick={correctPick} onAssembled={assembled} />
      </View>
    </LessonChrome>
  );
}
