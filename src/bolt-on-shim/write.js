import { areValidDeps, createClock, isValidClock } from "./clock.js";

const version = "1";

export const isValidWrite = (item) => {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.version === "string" &&
    item.key.version > 0 &&
    typeof item.key === "string" &&
    item.key.length > 0 &&
    areValidDeps(item.deps) && // eslint-disable-line no-use-before-define
    isValidClock(item.clock)
  );
};

export const createWrite = (nodeId, key, value, deps, tick) => {
  const clock = createClock(nodeId, tick);
  return {
    key,
    value,
    version,
    nodeId,
    clock,
    deps,
  };
};
