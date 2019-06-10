import { get, set } from "./store.js";

export default (storage = new Map()) => {
  return Object.seal(
    Object.assign(Object.create(null), {
      get: (key) => get(storage, key),
      set: (key, value) => set(storage, key, value),
    }),
  );
};
