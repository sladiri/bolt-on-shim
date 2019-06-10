import { areValidDeps, createClock, isValidClock } from "./clock.js";

const version = "1";

export const isValidWrite = (item, keyMayBeNull = false) => {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.version === "string" &&
    ((keyMayBeNull && item.key === null) || typeof item.key === "string") &&
    areValidDeps(item.deps) && // eslint-disable-line no-use-before-define
    isValidClock(item.clock)
  );
};

export const createWrite = (nodeId, key = null, value, deps) => {
  const clock = createClock(
    nodeId,
    0 /* TODO: remove, 0 is just easier to read while developing */,
  );
  return {
    key,
    value,
    version,
    nodeId,
    clock,
    deps,
  };
};
