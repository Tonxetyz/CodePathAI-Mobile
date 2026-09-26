import { AlertTriangle, ChevronRight, ShieldCheck } from "lucide-react-native";
import { type ReactElement, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { LessonResult, OctoMood } from "../types";
import { LessonChrome } from "./LessonChrome";

type Duel = { id: string; promptA: string; promptB: string; saferIndex: 0 | 1; explain: [string, string] };

const DUELS: Duel[] = [
  {
    id: "law",
    promptA: "Расскажи о новом законе о такси, который приняли на прошлой неделе.",
    promptB: "Объясни, как обычно устроено регулирование такси в России в целом — если не уверен в конкретных недавних изменениях, так и скажи.",
    saferIndex: 1,
    explain: [
      "Модель не имеет доступа к свежим новостям и, скорее всего, придумает несуществующий закон.",
      "Промпт разрешает модели признать неуверенность вместо того, чтобы выдумывать факты.",
    ],
  },
  {
    id: "api",
    promptA: "Напиши обёртку для API оплаты. Если не знаешь точных названий методов — придумай подходящие.",
    promptB: "Вот документация нашего API оплаты (вставлена ниже). Напиши обёртку строго по этим методам, ничего не добавляя от себя.",
    saferIndex: 1,
    explain: [
      "Фраза «придумай» — это прямое приглашение к галлюцинации несуществующих методов.",
      "Промпт даёт модели реальные входные данные и ограничивает её только ими.",
    ],
  },
  {
    id: "sales",
    promptA: "Дай мне точную статистику продаж нашей компании за 2025 год.",
    promptB: "Вот CSV с нашими продажами за 2025 год (приложен). Посчитай суммарную выручку по кварталам.",
    saferIndex: 1,
    explain: [
      "У модели нет доступа к внутренним данным компании — любой ответ будет выдумкой.",
      "Задача решается на приложенных данных, а не на догадках модели.",
    ],
  },
];

export function PromptDuelLesson({ onExit, onComplete }: { onExit: () => void; onComplete: (result: LessonResult) => void }): ReactElement {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<0 | 1 | null>(null);
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState<OctoMood>("idle");
  const [celebrate, setCelebrate] = useState(0);
  const [sound, setSound] = useState(0);
  const finished = round >= DUELS.length;
  const duel = DUELS[round];

  function pick(index: 0 | 1) {
    if (picked !== null) return;
    setPicked(index);
    const correct = index === duel.saferIndex;
    if (correct) { setScore((n) => n + 1); setMood("happy"); setCelebrate((n) => n + 1); }
    else { setMood("sad"); }
    setSound((n) => n + 1);
  }

  function next() {
    setPicked(null);
    setMood("idle");
    setRound((n) => n + 1);
  }

  const xp = score * 10;

  return (
    <LessonChrome
      eyebrow={`ПРОМПТ-ДУЭЛЬ · РАУНД ${Math.min(round + 1, DUELS.length)}/${DUELS.length}`}
      title="Какой промпт безопаснее?"
      onExit={onExit}
      mood={mood}
      caption={picked !== null ? duel.explain[picked] : "Выбери промпт, который с меньшей вероятностью вызовет выдумки модели."}
      celebrateTrigger={celebrate}
      soundTrigger={sound}
      complete={finished ? { xp } : undefined}
      onContinue={() => onComplete({ correct: score === DUELS.length, xp })}
    >
      {!finished ? (
        <View style={{ gap: 12 }}>
          <DuelCard label="A" text={duel.promptA} state={picked === null ? "idle" : picked === 0 ? (0 === duel.saferIndex ? "correct" : "wrong") : "muted"} onPress={() => pick(0)} />
          <DuelCard label="B" text={duel.promptB} state={picked === null ? "idle" : picked === 1 ? (1 === duel.saferIndex ? "correct" : "wrong") : "muted"} onPress={() => pick(1)} />
          {picked !== null ? (
            <Pressable onPress={next} style={{ alignItems: "center", backgroundColor: "#7C3AED", borderRadius: 16, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 6, padding: 15 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>{round === DUELS.length - 1 ? "Итоги" : "Следующая дуэль"}</Text>
              <ChevronRight color="white" size={18} />
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={{ alignItems: "center", backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 18, borderWidth: 1, padding: 20 }}>
          <ShieldCheck color="#22C55E" size={30} />
          <Text style={{ color: "#F8FAFC", fontSize: 17, fontWeight: "800", marginTop: 10 }}>{score} из {DUELS.length} верно</Text>
          <Text style={{ color: "#9CA9C4", fontSize: 12, marginTop: 4, textAlign: "center" }}>Безопасный промпт — тот, что опирается на реальные данные и честно признаёт границы знаний модели.</Text>
        </View>
      )}
    </LessonChrome>
  );
}

function DuelCard({ label, text, state, onPress }: { label: string; text: string; state: "idle" | "correct" | "wrong" | "muted"; onPress: () => void }): ReactElement {
  const border = state === "correct" ? "#22C55E" : state === "wrong" ? "#F87171" : "#2A3756";
  const bg = state === "correct" ? "#22C55E1A" : state === "wrong" ? "#F871711A" : "#151C31";
  return (
    <Pressable disabled={state !== "idle" && state !== "muted"} onPress={onPress} style={{ backgroundColor: bg, borderColor: border, borderRadius: 16, borderWidth: 1.5, opacity: state === "muted" ? 0.5 : 1, padding: 14 }}>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 6 }}>
        <View style={{ alignItems: "center", backgroundColor: "#1E2945", borderRadius: 9, height: 22, justifyContent: "center", width: 22 }}>
          <Text style={{ color: "#C4B5FD", fontSize: 12, fontWeight: "900" }}>{label}</Text>
        </View>
        {state === "correct" ? <ShieldCheck color="#22C55E" size={16} /> : null}
        {state === "wrong" ? <AlertTriangle color="#F87171" size={16} /> : null}
      </View>
      <Text style={{ color: "#E2E8F0", fontSize: 13, lineHeight: 19 }}>{text}</Text>
    </Pressable>
  );
}
