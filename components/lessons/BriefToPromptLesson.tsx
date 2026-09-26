import { MessageCircle } from "lucide-react-native";
import { type ReactElement, useState } from "react";
import { Text, View } from "react-native";
import type { LessonResult, OctoMood } from "../types";
import { LessonChrome } from "./LessonChrome";
import { PromptSlotBuilder, type BankChip } from "./PromptSlotBuilder";

const BRIEF =
  "«Слушай, мне нужен скрипт для магазина. Чтобы он сам собирал отзывы с трёх площадок и присылал мне только негативные, с оценкой ниже 3. И пусть не падает, если какая-то площадка не отвечает — таких сайтов и так хватает. На выходе — просто табличка, я её в Excel открою.»";

const BANK: BankChip[] = [
  { id: "role", label: "data-инженер, который делает интеграции с внешними API", category: "role" },
  { id: "input", label: "ссылки на три площадки с отзывами", category: "input" },
  { id: "task", label: "собрать отзывы с оценкой ниже 3 и отфильтровать их", category: "task" },
  { id: "constraints", label: "продолжать работу, если одна из площадок недоступна", category: "constraints" },
  { id: "format", label: "CSV-таблица, которая открывается в Excel", category: "format" },
  { id: "d1", label: "сделай что-нибудь с отзывами", category: "distractor" },
  { id: "d2", label: "он же простой сайт, разберёшься", category: "distractor" },
  { id: "d3", label: "как обычно делают", category: "distractor" },
];

export function BriefToPromptLesson({ onExit, onComplete }: { onExit: () => void; onComplete: (result: LessonResult) => void }): ReactElement {
  const [mood, setMood] = useState<OctoMood>("idle");
  const [caption, setCaption] = useState<string | undefined>(undefined);
  const [celebrate, setCelebrate] = useState(0);
  const [sound, setSound] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  function wrongPick() {
    setMood("sad");
    setCaption("В тексте клиента этого нет — это додумка, а не факт из брифа.");
    setSound((n) => n + 1);
  }
  function correctPick() {
    setMood("thinking");
    setCaption(undefined);
  }
  function assembled(prompt: string) {
    setDone(prompt);
    setMood("happy");
    setCaption("Именно так превращается хаотичный текст клиента в промпт, который можно отдать нейросети.");
    setCelebrate((n) => n + 1);
    setSound((n) => n + 1);
  }

  return (
    <LessonChrome
      eyebrow="ПРАКТИКА · ИЗ БРИФА В ПРОМПТ"
      title="Собери промпт из текста клиента"
      onExit={onExit}
      mood={mood}
      caption={caption}
      celebrateTrigger={celebrate}
      soundTrigger={sound}
      complete={done ? { xp: 30 } : undefined}
      onContinue={() => onComplete({ correct: true, xp: 30, prompt: done ?? undefined })}
    >
      <View style={{ alignItems: "flex-start", backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 10, padding: 13 }}>
        <MessageCircle color="#22D3EE" size={18} />
        <Text style={{ color: "#C4B5FD", flex: 1, fontSize: 13, lineHeight: 19 }}>{BRIEF}</Text>
      </View>
      <Text style={{ color: "#9CA9C4", fontSize: 13, lineHeight: 19, marginTop: 14 }}>
        Разбери текст клиента на пять блоков промпта. Убери додумки — бери только то, что клиент реально сказал.
      </Text>
      <View style={{ marginTop: 16 }}>
        <PromptSlotBuilder bank={BANK} onWrongPick={wrongPick} onCorrectPick={correctPick} onAssembled={assembled} />
      </View>
    </LessonChrome>
  );
}
