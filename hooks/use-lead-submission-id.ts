"use client";
import { useRef } from "react";

// Keep an ID across retries of the same payload, including a lost response.
// Editing the inquiry creates a new ID; confirmed success clears the attempt.
export function useLeadSubmissionId() {
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  return {
    forPayload(payload: object) {
      const serialized = JSON.stringify(payload);
      if (!attempt.current || attempt.current.payload !== serialized) {
        attempt.current = { payload: serialized, id: crypto.randomUUID() };
      }
      return attempt.current.id;
    },
    clear() {
      attempt.current = null;
    },
  };
}
