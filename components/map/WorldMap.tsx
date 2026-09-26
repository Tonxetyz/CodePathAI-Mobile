import { Bug, Check, Crown, Laptop, Lock, MessageCircle, Sparkles, Swords } from "lucide-react-native";
import { type ReactElement, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { LessonId } from "../types";
import { WORLD_MODULES } from "./mapData";

type NodeState = "done" | "current" | "locked";

function iconFor(id: LessonId, color: string, size: number): ReactNode {
  if (id.startsWith("prompt-builder")) return <Sparkles color={color} size={size} />;
  if (id.startsWith("prompt-duel")) return <MessageCircle color={color} size={size} />;
  if (id.startsWith("code-fix")) return <Bug color={color} size={size} />;
  if (id.startsWith("boss")) return <Swords color={color} size={size} />;
  return <Sparkles color={color} size={size} />;
}

export function WorldMap({ completed, onOpenLesson, onOpenSync }: { completed: Set<LessonId>; onOpenLesson: (id: LessonId) => void; onOpenSync: () => void }): ReactElement {
  let previousModuleDone = true;

  return (
    <View style={{ marginTop: 26 }}>
      <Pressable onPress={onOpenSync} style={{ alignItems: "center", backgroundColor: "#12213A", borderColor: "#22D3EE55", borderRadius: 19, borderWidth: 1, flexDirection: "row", gap: 12, padding: 15 }}>
        <View style={{ alignItems: "center", backgroundColor: "#06B6D424", borderRadius: 14, height: 44, justifyContent: "center", width: 44 }}>
          <Laptop color="#22D3EE" size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#F8FAFC", fontSize: 14, fontWeight: "800" }}>Связка с ПК</Text>
          <Text style={{ color: "#7DD3FC", fontSize: 11, marginTop: 2 }}>QR-код или 6-значный код · перенеси промпт в терминал</Text>
        </View>
        <View style={{ alignItems: "center", backgroundColor: "#22D3EE", borderRadius: 11, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ color: "#083344", fontSize: 11, fontWeight: "900" }}>Открыть</Text>
        </View>
      </Pressable>

      {WORLD_MODULES.map((module) => {
        const moduleUnlocked = previousModuleDone;
        let previousNodeDone = true;
        const rendered = (
          <View key={module.id} style={{ marginTop: 30, opacity: moduleUnlocked ? 1 : 0.45 }}>
            <View style={{ backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 15, marginBottom: 18, padding: 14 }}>
              <Text style={{ color: "#67E8F9", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 }}>{module.title}</Text>
              <Text style={{ color: "#9CA9C4", fontSize: 12, marginTop: 3 }}>{module.subtitle}</Text>
            </View>
            <View style={{ gap: 20 }}>
              {module.nodes.map((node, i) => {
                const done = completed.has(node.id);
                const isCurrent = moduleUnlocked && !done && previousNodeDone;
                const state: NodeState = done ? "done" : moduleUnlocked && isCurrent ? "current" : "locked";
                previousNodeDone = done;
                const offset = i % 2 === 0 ? "left" : "right";
                return <WorldNodeBubble key={node.id} id={node.id} title={node.title} xp={node.xp} boss={!!node.boss} state={state} offset={offset} onPress={() => state !== "locked" && onOpenLesson(node.id)} />;
              })}
            </View>
          </View>
        );
        previousModuleDone = module.nodes.every((node) => completed.has(node.id));
        return rendered;
      })}
    </View>
  );
}

function WorldNodeBubble({ id, title, xp, boss, state, offset, onPress }: { id: LessonId; title: string; xp: number; boss: boolean; state: NodeState; offset: "left" | "right"; onPress: () => void }): ReactElement {
  const size = boss ? 84 : 68;
  const bg = state === "done" ? "#22C55E" : state === "current" ? (boss ? "#F59E0B" : "#8B5CF6") : "#263746";
  const border = state === "done" ? "#86EFAC" : state === "current" ? (boss ? "#FDE68A" : "#DDD6FE") : "#20303E";
  const iconColor = state === "locked" ? "#64748B" : "white";

  return (
    <Pressable onPress={onPress} disabled={state === "locked"} style={{ alignItems: offset === "left" ? "flex-start" : "flex-end", paddingHorizontal: 6 }}>
      <View style={{ alignItems: "center", width: size + 40 }}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: bg,
            borderColor: border,
            borderRadius: size / 2,
            borderWidth: boss ? 4 : 3,
            height: size,
            justifyContent: "center",
            shadowColor: state === "current" ? bg : "transparent",
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: state === "current" ? 0.75 : 0,
            shadowRadius: 12,
            width: size,
          }}
        >
          {state === "done" ? <Check color="white" size={boss ? 34 : 27} /> : state === "locked" ? <Lock color={iconColor} size={boss ? 30 : 24} /> : boss ? <Crown color="white" size={32} /> : iconFor(id, iconColor, 26)}
        </View>
        <Text style={{ color: state === "locked" ? "#64748B" : "#E2E8F0", fontSize: boss ? 12 : 11, fontWeight: "900", marginTop: 6, maxWidth: size + 30, textAlign: "center" }}>{title}</Text>
        {state !== "locked" ? <Text style={{ color: "#9CA9C4", fontSize: 10, fontWeight: "700", marginTop: 2 }}>+{xp} XP</Text> : null}
      </View>
    </Pressable>
  );
}
