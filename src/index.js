import createShim from "./bolt-on-shim/index.js";
import createStore from "./kv-store/index.js";

console.log("Test Store");

const stored = [
  [
    "aaa",
    JSON.stringify({
      key: "aaa",
      value: { a: 42 },
      version: "1",
      nodeId: "a",
      clock: { a: 0 },
      deps: [],
    }),
  ],
];

const testStore = async (store) => {
  const objC = { z: 123 };
  await store.set("ccc", objC, ["aaa"]);
  console.log("result", await store.get("aaa"), await store.get("ccc"));
};

(async () => {
  try {
    const store = createShim(
      "a",
      createStore(new Map(stored)),
      createStore(new Map(stored)),
      1,
    );

    await testStore(store);
  } catch (error) {
    console.error(error);
  }
})();

export default createShim;
