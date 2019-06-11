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
  await store.set("xxx", objC, ["aaa"]);
  // console.log("result", await store.get("aaa"), await store.get("xxx"));
  console.log("result bbb", await store.get("bbb"));
  objC.z = 999;
  console.log("result xxx", await store.get("xxx"));
  await store.set("xxx", objC, ["aaa"]);
  console.log("result xxx", await store.get("xxx"));
};

(async () => {
  try {
    const store = createShim(
      "a",
      createStore(
        new Map([
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
          [
            "bbb",
            JSON.stringify({
              key: "bbb",
              value: { a: 123 },
              version: "1",
              nodeId: "a",
              clock: { a: 0 },
              deps: [
                {
                  key: "ccc",
                  value: { a: 42 },
                  version: "1",
                  nodeId: "a",
                  clock: { b: 0 },
                  deps: [],
                },
              ],
            }),
          ],
        ]),
      ),
      createStore(
        new Map([
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
          [
            "bbb",
            JSON.stringify({
              key: "bbb",
              value: { a: 234 },
              version: "1",
              nodeId: "a",
              clock: { a: 0 },
              deps: [
                {
                  key: "ccc",
                  value: { a: 42 },
                  version: "1",
                  nodeId: "a",
                  clock: { b: 0 },
                  deps: [],
                },
              ],
            }),
          ],
          // [
          //   "ccc",
          //   JSON.stringify({
          //     key: "ccc",
          //     value: { a: 42 },
          //     version: "1",
          //     nodeId: "a",
          //     clock: { b: 0 },
          //     deps: [],
          //   }),
          // ],
        ]),
      ),
      1,
    );

    await testStore(store);
  } catch (error) {
    console.error(error);
  }
})();

export default createShim;
