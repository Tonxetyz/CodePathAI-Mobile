import { ArrowLeft, Sparkles } from "lucide-react-native";
import { type ReactElement, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { OctoMood } from "../types";
import { OctoMate } from "../octo/OctoMate";

type Props = {
  eyebrow: string;
  title: string;
  onExit: () => void;
  mood: OctoMood;
  caption?: string;
  celebrateTrigger?: number;
  soundTrigger?: number;
  complete?: { xp: number };
  onContinue?: () => void;
  children: ReactNode;
};

export function LessonChrome({ eyebrow, title, onExit, mood, caption, celebrateTrigger, soundTrigger, complete, onContinue, children }: Props): ReactElement {
  return (
    <View style={{ backgroundColor: "#0B1020", flex: 1 }}>
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 16, paddingTop: 20 }}>
        <Pressable onPress={onExit} style={{ alignItems: "center", backgroundColor: "#151C31", borderRadius: 13, flexDirection: "row", gap: 7, paddingHorizontal: 12, paddingVertical: 9 }}>
          <ArrowLeft color="#F8FAFC" size={18} />
          <Text style={{ color: "#F8FAFC", fontSize: 13, fontWeight: "800" }}>Карта</Text>
        </Pressable>
        <OctoMate size="small" mood={mood} celebrateTrigger={celebrateTrigger} soundTrigger={soundTrigger} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, paddingTop: 4 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: "#8B5CF6", fontSize: 11, fontWeight: "800", letterSpacing: 1.3 }}>{eyebrow}</Text>
        <Text style={{ color: "#F8FAFC", fontSize: 24, fontWeight: "800", letterSpacing: -0.6, marginTop: 4 }}>{title}</Text>
        {caption ? (
          <View style={{ alignItems: "flex-start", backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 9, marginTop: 14, padding: 12 }}>
            <Sparkles color="#A78BFA" size={16} />
            <Text style={{ color: "#C4B5FD", flex: 1, fontSize: 12, lineHeight: 17 }}>{caption}</Text>
          </View>
        ) : null}
        <View style={{ marginTop: 18 }}>{children}</View>
      </ScrollView>
      {complete ? (
        <View style={{ backgroundColor: "#151C31", borderColor: "#2A3756", borderTopWidth: 1, flexDirection: "row", alignItems: "center", gap: 12, padding: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#F8FAFC", fontSize: 14, fontWeight: "800" }}>Урок пройден</Text>
            <Text style={{ color: "#A78BFA", fontSize: 12, fontWeight: "800", marginTop: 2 }}>+{complete.xp} XP</Text>
          </View>
          <Pressable onPress={onContinue} style={{ backgroundColor: "#7C3AED", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13 }}>
            <Text style={{ color: "white", fontSize: 13, fontWeight: "800" }}>Продолжить</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
