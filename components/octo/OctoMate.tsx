import { type ReactElement, useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import type { OctoMood } from "../types";
import { Confetti } from "./Confetti";

type Props = {
  size?: "small" | "large";
  mood?: OctoMood;
  caption?: string;
  /** bump this number to fire a confetti burst (e.g. on a correct answer) */
  celebrateTrigger?: number;
  /** bump this number to pulse the sound-wave micro-indicator (stands in for audio cues) */
  soundTrigger?: number;
};

const HEAD_COLOR: Record<OctoMood, string> = { idle: "#8B5CF6", happy: "#22C55E", sad: "#6D43D7", thinking: "#7C3AED" };

export function OctoMate({ size = "large", mood = "idle", caption, celebrateTrigger = 0, soundTrigger = 0 }: Props): ReactElement {
  const small = size === "small";
  const bob = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const eyeShift = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: mood === "sad" ? 1400 : 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: mood === "sad" ? 1400 : 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, mood]);

  useEffect(() => {
    Animated.spring(tilt, { toValue: mood === "sad" ? 1 : mood === "happy" ? -1 : 0, useNativeDriver: true, speed: 14, bounciness: mood === "happy" ? 12 : 6 }).start();
  }, [mood, tilt]);

  useEffect(() => {
    if (mood !== "thinking") { eyeShift.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(eyeShift, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(eyeShift, { toValue: -1, duration: 500, useNativeDriver: true }),
        Animated.timing(eyeShift, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mood, eyeShift]);

  useEffect(() => {
    if (soundTrigger === 0) return;
    wave.setValue(0);
    Animated.timing(wave, { toValue: 1, duration: 650, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [soundTrigger, wave]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, mood === "happy" ? -7 : -3] });
  const rotate = tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: ["-7deg", "0deg", "8deg"] });
  const eyeTranslateX = eyeShift.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] });

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View style={{ alignItems: "center", height: small ? 54 : 88, justifyContent: "flex-end", transform: [{ translateY }, { rotate }], width: small ? 49 : 80 }}>
        <View style={{ alignItems: "center", backgroundColor: HEAD_COLOR[mood], borderRadius: small ? 24 : 34, height: small ? 42 : 60, justifyContent: "center", transform: small ? [{ scale: 0.82 }] : undefined, width: small ? 45 : 64 }}>
          <View style={{ flexDirection: "row", gap: 9, marginTop: 2 }}>
            <Eye pupilShift={eyeTranslateX} sad={mood === "sad"} />
            <Eye pupilShift={eyeTranslateX} sad={mood === "sad"} />
          </View>
          <Mouth mood={mood} />
        </View>
        <View style={{ flexDirection: "row", height: 23, marginTop: -4 }}>
          {[0, 1, 2].map((i) => <Tentacle key={i} phase={i} />)}
        </View>
        <Confetti trigger={celebrateTrigger} />
      </Animated.View>
      {caption ? (
        <View style={{ backgroundColor: "#1A1D24", borderColor: "#2A2E39", borderRadius: 12, borderWidth: 1, marginTop: 8, maxWidth: 220, paddingHorizontal: 10, paddingVertical: 7 }}>
          <Text style={{ color: "#E5E7EB", fontSize: 12, fontWeight: "700", lineHeight: 16, textAlign: "center" }}>{caption}</Text>
        </View>
      ) : null}
      {soundTrigger > 0 ? <SoundWave progress={wave} /> : null}
    </View>
  );
}

function Eye({ pupilShift, sad }: { pupilShift: Animated.AnimatedInterpolation<number>; sad: boolean }): ReactElement {
  return (
    <View style={{ alignItems: "center", backgroundColor: "white", borderRadius: 9, height: sad ? 12 : 18, justifyContent: "center", width: 15 }}>
      <Animated.View style={{ backgroundColor: "#22203A", borderRadius: 4, height: 8, transform: [{ translateX: pupilShift }], width: 6 }} />
    </View>
  );
}

function Mouth({ mood }: { mood: OctoMood }): ReactElement {
  if (mood === "sad") {
    return <View style={{ borderColor: "#3F337D", borderTopWidth: 2, borderRadius: 9, height: 6, marginTop: 5, transform: [{ rotate: "180deg" }], width: 13 }} />;
  }
  if (mood === "happy") {
    return <View style={{ borderBottomColor: "#F0FDF4", borderBottomWidth: 3, borderRadius: 10, height: 9, marginTop: 4, width: 17 }} />;
  }
  return <View style={{ borderBottomColor: "#3F337D", borderBottomWidth: 2, borderRadius: 9, height: 7, marginTop: 4, width: 14 }} />;
}

function Tentacle({ phase }: { phase: number }): ReactElement {
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 900, delay: phase * 140, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, sway]);
  const rotate = sway.interpolate({ inputRange: [0, 1], outputRange: ["176deg", "184deg"] });
  return (
    <Animated.Text style={{ color: "#6D43D7", fontSize: 31, fontWeight: "900", lineHeight: 29, marginHorizontal: -2, transform: [{ rotate }] }}>⌒</Animated.Text>
  );
}

// ponytail: visual stand-in for audio feedback — no sound asset/expo-audio wired up; swap for real playback when an SFX file ships
function SoundWave({ progress }: { progress: Animated.Value }): ReactElement {
  return (
    <View style={{ flexDirection: "row", gap: 3, height: 14, marginTop: 6 }}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{
            backgroundColor: "#22D3EE",
            borderRadius: 2,
            width: 3,
            opacity: progress.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] }),
            height: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [4, 4 + i * 4 + 6, 4] }),
          }}
        />
      ))}
    </View>
  );
}
