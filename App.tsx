import "./global.css";

import { StatusBar } from "expo-status-bar";
import type { ReactElement } from "react";
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PromptLabScreen } from "./components/PromptLabScreen";

export default function App(): ReactElement {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={{ backgroundColor: "#0F1117", flex: 1 }}>
        <StatusBar style="light" />
        <PromptLabScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
