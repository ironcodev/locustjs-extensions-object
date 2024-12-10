import { merge } from "../index.esm.js";

const tests = [
  [
    "merge: 1",
    function (expect) {
      expect(merge(null, null)).toBe(null);
      expect(merge(null, undefined)).toBe(null);
      expect(merge(undefined, undefined)).toBeUndefined();
    },
  ],
  [
    "merge: 2",
    function (expect) {
      const result = merge(null, {});

      expect(JSON.stringify(result)).toBe('{}');
    },
  ],
  [
    "merge: 3",
    function (expect) {
      const result = merge({a: 10}, {b: true});

      expect(JSON.stringify(result)).toBe('{"a":10,"b":true}');
    },
  ],
  [
    "merge: 4",
    function (expect) {
      const x = { name: "John" };
      const a = { a: 10 };
      const b = { b: "test" };

      const result = merge(x, a, b);

      expect(JSON.stringify(result)).toBe('{"name":"John","a":10,"b":"test"}');
    },
  ],
];

export default tests;
