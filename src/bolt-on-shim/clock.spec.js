import chai from "chai";
import { isEqual, isConcurrent, happensBefore } from "./clock.js";

const assert = chai.assert;

(async () => {
  try {
    assert.isOk(
      isEqual({ a: 42 }, { a: 42 }),
      "clock/isEqual with identical clocks",
    );
    assert.isOk(
      !isEqual({ a: 42 }, { a: 43 }),
      "clock/isEqual with different clocks",
    );

    assert.isOk(
      isConcurrent({ a: 42 }, { b: 42 }),
      "clock/isConcurrent with concurrent clocks",
    );
    assert.isOk(
      !isConcurrent({ a: 42 }, { a: 42 }),
      "clock/isConcurrent with identical clocks",
    );

    assert.isOk(
      happensBefore({ a: 42 }, { a: 41 }),
      "clock/happensBefore with causally-related clocks",
    );
    assert.isOk(
      !happensBefore({ a: 42 }, { a: 42 }),
      "clock/happensBefore with identical clocks",
    );
    assert.isOk(
      !happensBefore({ a: 41 }, { a: 42 }),
      "clock/happensBefore with reversed clocks",
    );
  } catch (error) {
    console.error(error);
  }
})();
