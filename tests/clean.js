import { clean } from "../index.esm.js";

const tests = [
  [
    "clean: 1",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = clean(x);

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "clean: 2",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = clean(x, "null");

      expect(Object.keys(result).join(",")).toBe(`a,c`);
    },
  ],
  [
    "clean: 3",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = clean(x, "null,undefined");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "clean: 4",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [] };
      const result = clean(x, "array");

      expect(Object.keys(result).join(",")).toBe(`a,b,c`);
    },
  ],
  [
    "clean: 5",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [] };
      const result = clean(x, "array,empty");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "clean: 6",
    function (expect) {
      const x = { a: 10, b: null, c: {} };
      const result = clean(x, "object");

      expect(Object.keys(result).join(",")).toBe(`a,b`);
    },
  ],
  [
    "clean: 7",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [], e: {} };
      const result = clean(x, "array,empty,object");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "clean: 8",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0 };
      const result = clean(x, "zero");

      expect(Object.keys(result).join(",")).toBe(`a,b,c`);
    },
  ],
  [
    "clean: 9",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0, e: "" };
      const result = clean(x, "string");

      expect(Object.keys(result).join(",")).toBe(`a,b,c,d`);
    },
  ],
  [
    "clean: 10",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0, e: "", f: "   " };
      const result = clean(x, "whitespace");

      expect(Object.keys(result).join(",")).toBe(`a,b,c,d`);
    },
  ],
  [
    "clean: 11",
    function (expect) {
      const x = {
        a: 10,
        b: null,
        c: undefined,
        d: [],
        e: {},
        f: 0,
        g: "",
        h: "   ",
      };
      const result = clean(x, "all");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
];

export default tests;
