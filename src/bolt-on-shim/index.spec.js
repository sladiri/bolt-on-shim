import chai from "chai";
import createShim from "./index.js";
import createStore from "../kv-store/index.js";
import { isValidWrite } from "./write.js";

const assert = chai.assert;

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
          [
            "ccc",
            JSON.stringify({
              key: "ccc",
              value: { a: 42 },
              version: "1",
              nodeId: "a",
              clock: { b: 0 },
              deps: [],
            }),
          ],
        ]),
      ),
      1,
    );
    assert.isOk(
      (await store.get("bbb")).a === 234,
      "shim finds write with covered dependency",
    );
  } catch (error) {
    console.error(error);
  }
})();

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
        ]),
      ),
      1,
    );
    assert.isOk(
      (await store.get("bbb")).a === 123,
      "shim finds write with uncovered dependency",
    );
  } catch (error) {
    console.error(error);
  }
})();
