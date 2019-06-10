import createShim from "./bolt-on-shim/index.js";

console.log("Test Store\n");

const testStore = async (store) => {
  console.log("a", await store.get("abc"));
  const obj = { x: 42 };
  await store.set("abc", obj);
  console.log("b", await store.get("abc"));
};

(async () => {
  try {
    const store = createShim("a");

    await testStore(store);
  } catch (error) {
    console.error(error);
  }
})();

export default createShim;
