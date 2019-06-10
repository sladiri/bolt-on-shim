import chai from "chai";
import { isValidWrite } from "./write.js";

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

export const createClock = (nodeId, deps) => {
  assert.isOk(isValidNodeId(nodeId), "createClock got invalid nodeId");
  assert.isOk(areValidDeps(deps), "createClock got invalid deps");
  return { [nodeId]: 0 };
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

export const happensBefore = (writeRef, write) => {
  assert.isOk(
    isValidWrite(writeRef),
    "happensBefore got invalid reference-dependency",
  );
  assert.isOk(isValidWrite(write), "happensBefore got invalid dependency");
  return false;
};

export const incrementClock = (nodeId, clock) => {
  assert.isOk(isValidNodeId(nodeId), "incrementClock got invalid nodeId");
  assert.isOk(isValidClock(clock), "incrementClock got invalid clock");
  return { ...clock, [nodeId]: clock[nodeId] + 1 };
};
