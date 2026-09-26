import { type ReactElement } from "react";
import { Modal } from "react-native";
import type { LessonId, LessonResult } from "../types";
import { BriefToPromptLesson } from "./BriefToPromptLesson";
import { CodeFixLesson } from "./CodeFixLesson";
import { PromptBuilderLesson } from "./PromptBuilderLesson";
import { PromptDuelLesson } from "./PromptDuelLesson";

type Props = {
  lessonId: LessonId | null;
  onClose: () => void;
  onComplete: (lessonId: LessonId, result: LessonResult) => void;
};

export function LessonModal({ lessonId, onClose, onComplete }: Props): ReactElement | null {
  if (!lessonId) return null;

  function complete(result: LessonResult) {
    onComplete(lessonId as LessonId, result);
  }

  return (
    <Modal animationType="slide" presentationStyle="fullScreen" visible={!!lessonId} onRequestClose={onClose}>
      {lessonId === "prompt-builder-2" && <PromptBuilderLesson onExit={onClose} onComplete={complete} />}
      {(lessonId === "prompt-duel-1" || lessonId === "prompt-duel-2" || lessonId === "boss-duel") && <PromptDuelLesson onExit={onClose} onComplete={complete} />}
      {(lessonId === "code-fix-1" || lessonId === "code-fix-2") && <CodeFixLesson onExit={onClose} onComplete={complete} />}
      {(lessonId === "brief-to-prompt-1" || lessonId === "brief-to-prompt-2" || lessonId === "boss-brief") && <BriefToPromptLesson onExit={onClose} onComplete={complete} />}
    </Modal>
  );
}
