import { Bug, Check, ChevronRight } from "lucide-react-native";
import { type ReactElement, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { LessonResult, OctoMood } from "../types";
import { LessonChrome } from "./LessonChrome";

type Round = { id: string; lines: string[]; buggyIndex: number; candidates: string[]; correctIndex: number; explanation: string };

const ROUNDS: Round[] = [
  {
    id: "off-by-one",
    lines: ["def get_last_item(items):", "    return items[len(items)]"],
    buggyIndex: 1,
    candidates: ["return items[len(items)]", "return items[len(items) - 1]", "return items[-2]"],
    correctIndex: 1,
    explanation: "Индексы в Python начинаются с 0 — последний элемент лежит по индексу len(items) - 1.",
  },
  {
    id: "assignment",
    lines: ["def is_discount_active(percent):", "    if percent = 0:", "        return False", "    return True"],
    buggyIndex: 1,
    candidates: ["if percent = 0:", "if percent == 0:", "if percent < 0:"],
    correctIndex: 1,
    explanation: "Одиночный «=» — это присваивание, а не сравнение. Для проверки равенства нужен «==».",
  },
  {
    id: "keyerror",
    lines: ["def get_total(item):", "    return item[\"price\"] * item[\"quantity\"]"],
    buggyIndex: 1,
    candidates: ["return item[\"price\"] * item[\"quantity\"]", "return item.get(\"price\", 0) * item.get(\"quantity\", 0)", "return item[\"price\"] + item[\"quantity\"]"],
    correctIndex: 1,
    explanation: "«.get(key, default)» не бросает KeyError, если поля нет в словаре — а именно это роняло код.",
  },
];

export function CodeFixLesson({ onExit, onComplete }: { onExit: () => void; onComplete: (result: LessonResult) => void }): ReactElement {
  const [round, setRound] = useState(0);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState<OctoMood>("idle");
  const [celebrate, setCelebrate] = useState(0);
  const [sound, setSound] = useState(0);
  const finished = round >= ROUNDS.length;
  const data = ROUNDS[round];

  function pick(index: number) {
    if (pickedIndex !== null) return;
    setPickedIndex(index);
    const correct = index === data.correctIndex;
    if (correct) { setScore((n) => n + 1); setMood("happy"); setCelebrate((n) => n + 1); }
    else { setMood("sad"); }
    setSound((n) => n + 1);
  }

  function next() {
    setPickedIndex(null);
    setMood("idle");
    setRound((n) => n + 1);
  }

  const xp = score * 10;
  const fixedLine = pickedIndex === data?.correctIndex ? data?.candidates[data.correctIndex] : null;

  return (
    <LessonChrome
      eyebrow={`ЧТЕНИЕ КОДА · РАУНД ${Math.min(round + 1, ROUNDS.length)}/${ROUNDS.length}`}
      title="Найди и почини баг"
      onExit={onExit}
      mood={mood}
      caption={pickedIndex !== null ? data.explanation : "В коде ниже есть одна сломанная строка. Выбери, чем её заменить."}
      celebrateTrigger={celebrate}
      soundTrigger={sound}
      complete={finished ? { xp } : undefined}
      onContinue={() => onComplete({ correct: score === ROUNDS.length, xp })}
    >
      {!finished ? (
        <View>
          <View style={{ alignItems: "center", backgroundColor: "#F59E0B18", borderColor: "#F59E0B40", borderRadius: 13, borderWidth: 1, flexDirection: "row", gap: 8, marginBottom: 14, padding: 10 }}>
            <Bug color="#FBBF24" size={16} />
            <Text style={{ color: "#FDE68A", fontSize: 11, fontWeight: "800" }}>СТРОКА {data.buggyIndex + 1} ПАДАЕТ С ОШИБКОЙ</Text>
          </View>
          <View style={{ backgroundColor: "#0A0F1D", borderColor: "#263552", borderRadius: 18, borderWidth: 1, paddingVertical: 12 }}>
            {data.lines.map((line, i) => {
              const isBuggy = i === data.buggyIndex;
              const shown = isBuggy && fixedLine ? fixedLine : line;
              return (
                <View key={i} style={{ backgroundColor: isBuggy ? (fixedLine ? "#22C55E18" : "#F59E0B18") : "transparent", flexDirection: "row", minHeight: 25, paddingHorizontal: 14 }}>
                  <Text style={{ color: "#64748B", fontFamily: "monospace", fontSize: 11, width: 28 }}>{String(i + 1).padStart(2, "0")}</Text>
                  <Text style={{ color: isBuggy ? (fixedLine ? "#86EFAC" : "#FCD34D") : "#C4B5FD", fontFamily: "monospace", fontSize: 11 }}>{shown}</Text>
                </View>
              );
            })}
          </View>
          <Text style={{ color: "#9CA9C4", fontSize: 11, fontWeight: "800", letterSpacing: 1, marginTop: 18, marginBottom: 10 }}>ЧЕМ ЗАМЕНИТЬ СТРОКУ {data.buggyIndex + 1}?</Text>
          <View style={{ gap: 9 }}>
            {data.candidates.map((candidate, i) => {
              const state = pickedIndex === null ? "idle" : i === data.correctIndex ? "correct" : i === pickedIndex ? "wrong" : "muted";
              return (
                <Pressable key={i} disabled={pickedIndex !== null} onPress={() => pick(i)} style={{ backgroundColor: state === "correct" ? "#22C55E1A" : state === "wrong" ? "#F871711A" : "#151C31", borderColor: state === "correct" ? "#22C55E" : state === "wrong" ? "#F87171" : "#2A3756", borderRadius: 13, borderWidth: 1.5, flexDirection: "row", justifyContent: "space-between", opacity: state === "muted" ? 0.5 : 1, padding: 12 }}>
                  <Text style={{ color: "#E2E8F0", flex: 1, fontFamily: "monospace", fontSize: 12 }}>{candidate}</Text>
                  {state === "correct" ? <Check color="#22C55E" size={16} /> : null}
                </Pressable>
              );
            })}
          </View>
          {pickedIndex !== null ? (
            <Pressable onPress={next} style={{ alignItems: "center", backgroundColor: "#7C3AED", borderRadius: 16, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 16, padding: 15 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>{round === ROUNDS.length - 1 ? "Итоги" : "Следующий баг"}</Text>
              <ChevronRight color="white" size={18} />
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={{ alignItems: "center", backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 18, borderWidth: 1, padding: 20 }}>
          <Check color="#22C55E" size={30} />
          <Text style={{ color: "#F8FAFC", fontSize: 17, fontWeight: "800", marginTop: 10 }}>{score} из {ROUNDS.length} багов исправлено</Text>
        </View>
      )}
    </LessonChrome>
  );
}
