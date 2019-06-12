import chai from "chai";
import { isValidWrite } from "./write.js"; // TODO: remove, do not store complete write?

const assert = chai.assert;

export const isValidNodeId = (item) => {
  return typeof item === "string" && item.length > 0;
};

export const depsHaveDuplicates = (deps) => {
  return [...new Set(deps.map((d) => d.key)).values()].length !== deps.length;
};

export const areValidDeps = (deps) => {
  return (
    Array.isArray(deps) &&
    !deps.some((d) => !isValidWrite(d)) &&
    !depsHaveDuplicates(deps)
  );
};

export const isValidClockEntry = (entry) => {
  return (
    entry !== null &&
    typeof entry === "object" &&
    Object.values(entry).length === 1 &&
    typeof Object.values(entry)[0] === "number"
  );
};

export const isValidClock = (clock) => {
  return (
    clock !== null &&
    typeof clock === "object" &&
    Object.values(clock).length > 0 &&
    !Object.values(clock).some((x) => typeof x !== "number")
  );
};

export const isEqual = (clockRef, clock) => {
  assert.isOk(
    isValidClock(clockRef),
    "isEqual got invalid reference-dependency",
  );
  assert.isOk(isValidClock(clock), "isEqual got invalid dependency");
  const refKeys = Object.keys(clockRef);
  const writeKeys = Object.keys(clock);
  if (refKeys.length !== writeKeys.length) {
    return false;
  }
  return writeKeys.reduce(
    (acc, val) => acc && clockRef[val] === clock[val],
    true,
  );
};

export const isConcurrent = (clockRef, clock) => {
  assert.isOk(
    isValidClock(clockRef),
    "isConcurrent got invalid reference-dependency",
  );
  assert.isOk(isValidClock(clock), "isConcurrent got invalid dependency");
  const refKeys = Object.keys(clockRef);
  const writeKeys = Object.keys(clock);
  if (writeKeys.some((key) => !refKeys.includes(key))) {
    return true;
  }
  return false;
};

export const happensBefore = (clockRef, clock) => {
  assert.isOk(
    isValidClock(clockRef),
    "happensBefore got invalid reference-dependency",
  );
  assert.isOk(isValidClock(clock), "happensBefore got invalid dependency");
  if (isConcurrent(clockRef, clock)) {
    return false;
  }
  if (isEqual(clockRef, clock)) {
    return false;
  }
  const refKeys = Object.keys(clockRef);
  const writeKeys = Object.keys(clock);
  if (writeKeys.some((key) => clockRef[key] < clock[key])) {
    // TODO: <= or < ?
    return false;
  }
  return true;
};

export const incrementClock = (nodeId, clock) => {
  assert.isOk(isValidNodeId(nodeId), "incrementClock got invalid nodeId");
  assert.isOk(isValidClock(clock), "incrementClock got invalid clock");
  const nextTick = clock[nodeId] + 1;
  assert.isOk(
    Number.isSafeInteger(nextTick),
    "incrementClock wraps around tick",
  );
  return { ...clock, [nodeId]: nextTick };
};

export const mergeClocks = (clockA, clockB) => {
  const overlappingKeys = Object.keys(clockA).filter((key) =>
    Object.keys(clockB).includes(key),
  );
  const overlap = overlappingKeys.reduce((acc, key) => {
    acc[key] = clockA[key] > clockB[key] ? clockA[key] : clockB[key];
    return acc;
  }, {});
  // Sort keys just for convenience
  const unorderedResult = { ...clockA, ...clockB, ...overlap };
  const orderedResult = Object.keys(unorderedResult)
    .sort()
    .reduce((acc, key) => {
      acc[key] = unorderedResult[key];
      return acc;
    }, Object.create(null));
  return orderedResult;
};

export const createClock = (nodeId, tick) => {
  assert.isOk(isValidNodeId(nodeId), "createClock got invalid nodeId");
  assert.isOk(Number.isSafeInteger(tick), "createClock got invalid tick");
  return { [nodeId]: tick };
};
