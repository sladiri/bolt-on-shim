import chai from "chai";

const assert = chai.assert;

export const keyIsValid = (key) => {
  return typeof key === "string" && key.length > 0;
};

export const get = async (storage, key) => {
  assert.isOk(keyIsValid(key), "store.get: invalid key");

  const stored = storage.get(key);
  if (typeof stored !== "string") {
    return stored;
  }
  return JSON.parse(stored);
};

export const set = async (storage, key, value) => {
  assert.isOk(keyIsValid(key), "store.set: invalid key");

  storage.set(key, JSON.stringify(value));
};
