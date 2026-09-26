import { Check, X } from "lucide-react-native";
import { type ReactElement, useMemo, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export type SlotCategory = "role" | "input" | "task" | "constraints" | "format";
export type BankChip = { id: string; label: string; category: SlotCategory | "distractor" };

const SLOT_META: { id: SlotCategory; label: string }[] = [
  { id: "role", label: "Роль" },
  { id: "input", label: "Входные данные" },
  { id: "task", label: "Задача" },
  { id: "constraints", label: "Ограничения" },
  { id: "format", label: "Формат" },
];

type Props = {
  bank: BankChip[];
  onWrongPick: () => void;
  onCorrectPick: () => void;
  onAssembled: (prompt: string) => void;
};

export function PromptSlotBuilder({ bank, onWrongPick, onCorrectPick, onAssembled }: Props): ReactElement {
  const [filled, setFilled] = useState<Partial<Record<SlotCategory, BankChip>>>({});
  const shuffled = useMemo(() => [...bank].sort(() => Math.random() - 0.5), [bank]);
  const usedIds = new Set(Object.values(filled).map((c) => c?.id));
  const complete = SLOT_META.every((slot) => filled[slot.id]);

  function pick(chip: BankChip) {
    if (usedIds.has(chip.id)) return;
    if (chip.category === "distractor") {
      onWrongPick();
      return;
    }
    setFilled((prev) => ({ ...prev, [chip.category]: chip }));
    onCorrectPick();
  }

  function clearSlot(category: SlotCategory) {
    setFilled((prev) => { const next = { ...prev }; delete next[category]; return next; });
  }

  function assemble() {
    const text = SLOT_META.map((slot) => `${slot.label}: ${filled[slot.id]?.label ?? ""}`).join("\n");
    onAssembled(text);
  }

  return (
    <View>
      <View style={{ gap: 8 }}>
        {SLOT_META.map((slot) => (
          <Pressable key={slot.id} onPress={() => filled[slot.id] && clearSlot(slot.id)} style={{ backgroundColor: filled[slot.id] ? "#8B5CF61F" : "#151C31", borderColor: filled[slot.id] ? "#8B5CF6" : "#2A3756", borderRadius: 14, borderStyle: filled[slot.id] ? "solid" : "dashed", borderWidth: 1.5, padding: 12 }}>
            <Text style={{ color: "#9CA9C4", fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>{slot.label.toUpperCase()}</Text>
            <Text style={{ color: filled[slot.id] ? "#F8FAFC" : "#5B6785", fontSize: 13, fontWeight: "700", marginTop: 3 }}>{filled[slot.id]?.label ?? "Нажми на карточку снизу…"}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ color: "#9CA9C4", fontSize: 11, fontWeight: "800", letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>КИРПИЧИКИ ПРОМПТА</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {shuffled.map((chip) => <BankChipButton key={chip.id} chip={chip} used={usedIds.has(chip.id)} onPress={() => pick(chip)} />)}
      </View>

      <Pressable disabled={!complete} onPress={assemble} style={{ alignItems: "center", backgroundColor: complete ? "#7C3AED" : "#2A3756", borderRadius: 17, flexDirection: "row", gap: 9, justifyContent: "center", marginTop: 20, padding: 15 }}>
        <Check color={complete ? "white" : "#5B6785"} size={18} />
        <Text style={{ color: complete ? "white" : "#5B6785", fontSize: 14, fontWeight: "800" }}>Собрать промпт</Text>
      </Pressable>
    </View>
  );
}

function BankChipButton({ chip, used, onPress }: { chip: BankChip; used: boolean; onPress: () => void }): ReactElement {
  const shake = useRef(new Animated.Value(0)).current;

  function handlePress() {
    if (chip.category === "distractor") {
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
    }
    onPress();
  }

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-5, 5] });

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <Pressable disabled={used} onPress={handlePress} style={{ alignItems: "center", backgroundColor: used ? "#151C3155" : "#1E2945", borderColor: used ? "#2A3756" : "#3B4A75", borderRadius: 99, borderWidth: 1, flexDirection: "row", gap: 6, opacity: used ? 0.35 : 1, paddingHorizontal: 13, paddingVertical: 9 }}>
        {used ? <X color="#5B6785" size={13} /> : null}
        <Text style={{ color: used ? "#5B6785" : "#E2E8F0", fontSize: 12, fontWeight: "700" }}>{chip.label}</Text>
      </Pressable>
    </Animated.View>
  );
}
