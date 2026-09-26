import * as Clipboard from "expo-clipboard";
import { Check, Copy, RefreshCw, Send, X } from "lucide-react-native";
import { type ReactElement, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ponytail: decorative pattern only, not a real scannable QR — nothing on the other end to scan it in this demo. Swap for react-native-qrcode-svg if real device pairing ships.
function useQrPattern(seed: number): boolean[] {
  return useMemo(() => Array.from({ length: 81 }, () => Math.random() > 0.42), [seed]);
}

export function PcSyncSheet({ visible, onClose, lastPrompt }: { visible: boolean; onClose: () => void; lastPrompt: string | null }): ReactElement {
  const [code, setCode] = useState(randomCode);
  const [seed, setSeed] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sent, setSent] = useState(false);
  const pattern = useQrPattern(seed);

  function regenerate() {
    setCode(randomCode());
    setSeed((n) => n + 1);
    setCopiedCode(false);
  }

  async function copyCode() {
    await Clipboard.setStringAsync(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1400);
  }

  async function sendPrompt() {
    if (!lastPrompt) return;
    await Clipboard.setStringAsync(lastPrompt);
    setSent(true);
    setTimeout(() => setSent(false), 1600);
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ backgroundColor: "#00000088", flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "#0B1020", borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: "88%" }}>
          <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
              <View>
                <Text style={{ color: "#67E8F9", fontSize: 11, fontWeight: "900", letterSpacing: 1 }}>СВЯЗКА С ПК</Text>
                <Text style={{ color: "#F8FAFC", fontSize: 20, fontWeight: "800", marginTop: 3 }}>Claude Terminal Sync</Text>
              </View>
              <Pressable onPress={onClose} style={{ alignItems: "center", backgroundColor: "#151C31", borderRadius: 13, height: 40, justifyContent: "center", width: 40 }}>
                <X color="#F8FAFC" size={19} />
              </Pressable>
            </View>

            <View style={{ alignItems: "center", backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 20, borderWidth: 1, padding: 18 }}>
              <View style={{ backgroundColor: "white", borderRadius: 12, padding: 10 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", width: 9 * 8 }}>
                  {pattern.map((filled, i) => (
                    <View key={i} style={{ backgroundColor: filled ? "#0B1020" : "white", height: 8, width: 8 }} />
                  ))}
                </View>
              </View>
              <Text style={{ color: "#9CA9C4", fontSize: 11, marginTop: 12, textAlign: "center" }}>Отсканируй в приложении Claude Code на компьютере</Text>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 10, marginTop: 18 }}>
                <View style={{ alignItems: "center", backgroundColor: "#0A0F1D", borderColor: "#263552", borderRadius: 14, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12 }}>
                  <Text style={{ color: "#A5F3FC", fontFamily: "monospace", fontSize: 22, fontWeight: "900", letterSpacing: 6 }}>{code}</Text>
                </View>
                <Pressable onPress={regenerate} style={{ alignItems: "center", backgroundColor: "#1E2945", borderRadius: 13, height: 46, justifyContent: "center", width: 46 }}>
                  <RefreshCw color="#C4B5FD" size={18} />
                </Pressable>
              </View>

              <Pressable onPress={copyCode} style={{ alignItems: "center", backgroundColor: copiedCode ? "#15803D" : "#7C3AED", borderRadius: 13, flexDirection: "row", gap: 7, marginTop: 14, paddingHorizontal: 18, paddingVertical: 12 }}>
                {copiedCode ? <Check color="white" size={16} /> : <Copy color="white" size={16} />}
                <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>{copiedCode ? "Код скопирован" : "Скопировать код"}</Text>
              </Pressable>
            </View>

            <Text style={{ color: "#9CA9C4", fontSize: 11, fontWeight: "800", letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>ПОСЛЕДНИЙ СОБРАННЫЙ ПРОМПТ</Text>
            <View style={{ backgroundColor: "#151C31", borderColor: "#2A3756", borderRadius: 16, borderWidth: 1, padding: 14 }}>
              {lastPrompt ? (
                <>
                  <Text selectable style={{ color: "#E2E8F0", fontFamily: "monospace", fontSize: 12, lineHeight: 18 }}>{lastPrompt}</Text>
                  <Pressable onPress={sendPrompt} style={{ alignItems: "center", backgroundColor: sent ? "#15803D" : "#06B6D4", borderRadius: 13, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 14, padding: 13 }}>
                    {sent ? <Check color="#062A33" size={17} /> : <Send color="#062A33" size={17} />}
                    <Text style={{ color: "#062A33", fontSize: 13, fontWeight: "900" }}>{sent ? "Скопировано для терминала" : "Отправить промпт в терминал"}</Text>
                  </Pressable>
                </>
              ) : (
                <Text style={{ color: "#5B6785", fontSize: 12, lineHeight: 18 }}>Собери промпт в любом уроке-конструкторе — он появится здесь и его можно будет одной кнопкой отправить на ПК.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
