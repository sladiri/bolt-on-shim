import createStore from "../kv-store/index.js";
import { get, set } from "./shim.js";

/**
 * Note: Eventually consistent data store (ECDS)
 * must employ last-writer-wins semantics.
 */
export default (nodeId, local = createStore(), ecds = createStore()) => {
  return Object.seal(
    Object.assign(Object.create(null), {
      get: async (key) => {
        try {
          return await get(local, ecds, key);
        } catch (error) {
          console.error(error);
        }
      },
      set: async (key, value) => {
        try {
          await set(nodeId, local, ecds, key, value);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  );
};
