import { configureObjectExtensions } from "../src";

configureObjectExtensions("toJson");

const tests = [
  [
    "Object.toJson: 1",
    function (expect) {
      const x = { a: 10, b: null, c: 0 };

      const r1 = x.toJson();

      expect(r1).toBe('{"a":10,"b":null,"c":0}');
    },
  ],
  [
    "Object.toJson: 2",
    function (expect) {
      const x = { a: 10, b: null, c: 0 };

      const r1 = x.toJson("null");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
  [
    "Object.toJson: 3-1",
    function (expect) {
      const x = { a: 10, b: [], c: 0 };

      const r1 = x.toJson("array");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
  [
    "Object.toJson: 3-2",
    function (expect) {
      const x = { a: 10, b: [], c: 0, d: null };

      const r1 = x.toJson("array");

      expect(r1).toBe('{"a":10,"c":0,"d":null}');
    },
  ],
  [
    "Object.toJson: 3-3",
    function (expect) {
      const x = { a: 10, b: [], c: 0, d: null };

      const r1 = x.toJson("array,null");

      expect(r1).toBe('{"a":10,"c":0}');
    },
  ],
];

export default tests;
