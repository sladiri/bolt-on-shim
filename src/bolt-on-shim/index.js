import createStore from "../kv-store/index.js";
import { get, set } from "./shim.js";

/**
 * Note: Eventually consistent data store (ECDS)
 * must employ last-writer-wins semantics.
 */
export default (
  nodeId,
  local = createStore(),
  ecds = createStore(),
  // startTick = Number.MIN_SAFE_INTEGER,
  startTick = 0 /* TODO: remove, 0 is just easier to read while developing */,
) => {
  let tick = startTick;
  return Object.freeze(
    Object.assign(Object.create(null), {
      get: async (key) => {
        try {
          return await get(local, ecds, key);
        } catch (error) {
          console.error(error);
        }
      },
      set: async (key, value, deps = []) => {
        try {
          await set(nodeId, local, ecds, key, value, deps, tick);
          tick += 1;
        } catch (error) {
          console.error(error);
        }
      },
    }),
  );
};
