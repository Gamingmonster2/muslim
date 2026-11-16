import { useSyncExternalStore } from "react";
import { audioEngine } from "./engine";
import type { AudioSnapshot } from "./types";

export function useAudio(): AudioSnapshot {
  return useSyncExternalStore(audioEngine.subscribe, audioEngine.getSnapshot, audioEngine.getSnapshot);
}
