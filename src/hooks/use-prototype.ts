"use client";

import { useEffect, useSyncExternalStore } from "react";
import { prototypeStore } from "@/lib/state/store";
import { createSeedState } from "@/lib/mock-data/seed";

const serverSnapshot = createSeedState();

export function usePrototype() {
  const state = useSyncExternalStore(
    prototypeStore.subscribe,
    prototypeStore.getState,
    () => serverSnapshot,
  );
  const ready = useSyncExternalStore(
    prototypeStore.subscribe,
    () => prototypeStore.isReady(),
    () => false,
  );

  useEffect(() => {
    prototypeStore.hydrate();
  }, []);

  return { state, store: prototypeStore, ready };
}
