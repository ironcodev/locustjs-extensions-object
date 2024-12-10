import { toJson } from "../index.esm.js";

const tests = [
  [
    "toJson: 1",
    function (expect) {
      const x = { a: 10, b: null, c: 0 };

      const r1 = toJson(x);

      expect(r1).toBe('{"a":10,"b":null,"c":0}');
    },
  ],
  [
    "toJson: 2",
    function (expect) {
      const x = { a: 10, b: null, c: 0 };

      const r1 = toJson(x, "null");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
  [
    "toJson: 3-1",
    function (expect) {
      const x = { a: 10, b: [], c: 0 };

      const r1 = toJson(x, "array");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
  [
    "toJson: 3-2",
    function (expect) {
      const x = { a: 10, b: [], c: 0, d: null };

      const r1 = toJson(x, "array");

      expect(r1).toBe('{"a":10,"c":0,"d":null}');
    },
  ],
  [
    "toJson: 3-3",
    function (expect) {
      const x = { a: 10, b: [], c: 0, d: null };

      const r1 = toJson(x, "array,null");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
];

export default tests;
