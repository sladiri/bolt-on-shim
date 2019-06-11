import chai from "chai";
import { createWrite, isValidWrite } from "./write.js";
import { areValidDeps, happensBefore, mergeClocks } from "./clock.js";

const assert = chai.assert;

export const isCovered = async (local, ecds, eWrite, T) => {
  assert.isOk(isValidWrite(eWrite), "isCovered got invalid write from ECDS");
  assert.isOk(areValidDeps(T), "isCovered got invalid Set T");
  for (const dep of eWrite.deps) {
    // already applied a suitable write to local-store
    // or already covered a suitable write to dep.key?
    const lDep = await local.get(dep.key);
    assert.isOk(
      !lDep || isValidWrite(lDep),
      "isCovered got invalid write from local storage",
    );
    if (
      (lDep && !happensBefore(dep.clock, lDep.clock)) ||
      (T.find((d) => d.key === dep.key) &&
        !happensBefore(dep, T.find((d) => d.key === dep.key)))
    ) {
      continue;
    }
    // read from the ECDS and try to cover response
    const eDep = await ecds.get(dep.key);
    assert.isOk(
      !eDep || isValidWrite(eDep),
      "isCovered got invalid write from ECDS",
    );
    if (eDep && !happensBefore(dep.clock, eDep.clock)) {
      T.push(eDep);
      if (await isCovered(local, ecds, eDep, T)) {
        continue;
      }
    }
    return false;
  }
  return true;
};

export const get = async (local, ecds, key) => {
  const eWrite = await ecds.get(key);
  if (eWrite) {
    assert.isOk(isValidWrite(eWrite), "shim.get got invalid write from ECDS");
    const T = [eWrite];
    if (await isCovered(local, ecds, eWrite, T)) {
      for (const depWrite of T) {
        assert.isOk(isValidWrite(depWrite), "shim.get got invalid depWrite");
        await local.set(depWrite.key, depWrite);
      }
    }
  }

  const lWrite = await local.get(key);
  if (lWrite) {
    assert.isOk(
      isValidWrite(lWrite),
      "shim.get got invalid write from local storage",
    );
    return lWrite.value;
  }
  return;
};

export const set = async (nodeId, local, ecds, key, value, depkeys, tick) => {
  const depWrites = [];
  for (const depKey of depkeys) {
    const stored = await local.get(depKey);
    depWrites.push(stored);
  }
  let write = createWrite(nodeId, key, value, depWrites, tick);
  const lWrite = await local.get(key);
  if (lWrite) {
    write = {
      ...write,
      clock: mergeClocks(write.clock, lWrite.clock),
      // TODO: merge dependencies too?
    };
  }
  return {
    localOk: await local.set(key, write),
    ecdsOk: await ecds.set(key, write),
  };
};
