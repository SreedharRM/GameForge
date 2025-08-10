import { useState } from "react";

// Replace with Zustand/Redux or DB logic as needed
export function useGamePromptStore(): [string, (val: string) => void] {
  // For demo: global in-memory state (not persistent)
  const [finalGameIdea, setFinalGameIdea] = useState("");
  return [finalGameIdea, setFinalGameIdea];
}
