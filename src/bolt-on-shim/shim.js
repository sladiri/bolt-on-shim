import chai from "chai";
import { createWrite, isValidWrite } from "./write.js";
import { areValidDeps, happensBefore } from "./clock.js";

const assert = chai.assert;

export const isCovered = async (local, ecds, eWrite, T) => {
  assert.isOk(areValidDeps(T), "isCovered got invalid Set T");
  console.log("isCovered? T", eWrite, T.length, T);
  for (const dep of eWrite.deps) {
    // already applied a suitable write to local-store
    // or already covered a suitable write to dep.key?
    const lDep = await local.get(dep.key);
    assert.isOk(
      !lDep || isValidWrite(lDep),
      "isCovered got invalid write from local storage",
    );
    if (
      (lDep && !happensBefore(dep, lDep)) ||
      !happensBefore(dep, T.find((d) => d.key === dep.key))
    ) {
      continue;
    }
    // read from the ECDS and try to cover response
    const eDep = await ecds.get(dep.key);
    assert.isOk(
      !eDep || isValidWrite(eDep),
      "isCovered got invalid write from ECDS",
    );
    if (eDep && !happensBefore(dep, eDep)) {
      T.push(eDep);
      if (await isCovered(local, ecds, eDep, T)) {
        continue;
      }
    }
    console.log("isCovered=false");
    return false;
  }
  console.log("isCovered=true");
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

export const set = async (nodeId, local, ecds, key, value, deps = []) => {
  // TODO: Should caller pass writes instead?
  const depWrites = deps.map((key) => {
    const write = local.get(key);
    return write;
  });
  const write = createWrite(nodeId, key, value, depWrites);
  ecds.set(key, write);
  local.set(key, write);
};
