import { type ReactElement, useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

const COLORS = ["#8B5CF6", "#22D3EE", "#FBBF24", "#F472B6", "#4ADE80"];
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  angle: (i / 10) * Math.PI * 2 + Math.random() * 0.4,
  distance: 46 + Math.random() * 26,
  size: 6 + Math.random() * 5,
  delay: Math.random() * 60,
}));

// trigger: bump this number every time a burst should fire (e.g. correct answer count)
export function Confetti({ trigger }: { trigger: number }): ReactElement | null {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger === 0) return;
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [trigger, progress]);

  if (trigger === 0) return null;

  return (
    <View pointerEvents="none" style={{ alignItems: "center", height: 0, justifyContent: "center", position: "absolute", top: "50%", left: "50%", width: 0, zIndex: 20 }}>
      {PARTICLES.map((particle, i) => {
        const tx = Math.cos(particle.angle) * particle.distance;
        const ty = Math.sin(particle.angle) * particle.distance - 18;
        return (
          <Animated.View
            key={i}
            style={{
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
              height: particle.size,
              width: particle.size,
              position: "absolute",
              opacity: progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
              transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, tx] }) },
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, ty] }) },
                { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${180 + i * 40}deg`] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}
