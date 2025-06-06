import { configureObjectExtensions } from "../src";

configureObjectExtensions("clean");

const tests = [
  [
    "Object.clean: 1",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = x.clean();

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "Object.clean: 2",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = x.clean("null");

      expect(Object.keys(result).join(",")).toBe(`a,c`);
    },
  ],
  [
    "Object.clean: 3",
    function (expect) {
      const x = { a: 10, b: null, c: undefined };
      const result = x.clean("null,undefined");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "Object.clean: 4",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [] };
      const result = x.clean("array");

      expect(Object.keys(result).join(",")).toBe(`a,b,c`);
    },
  ],
  [
    "Object.clean: 5",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [] };
      const result = x.clean("array,empty");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "Object.clean: 6",
    function (expect) {
      const x = { a: 10, b: null, c: {} };
      const result = x.clean("object");

      expect(Object.keys(result).join(",")).toBe(`a,b`);
    },
  ],
  [
    "Object.clean: 7",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: [], e: {} };
      const result = x.clean("array,empty,object");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "Object.clean: 8",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0 };
      const result = x.clean("zero");

      expect(Object.keys(result).join(",")).toBe(`a,b,c`);
    },
  ],
  [
    "Object.clean: 9",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0, e: "" };
      const result = x.clean("string");

      expect(Object.keys(result).join(",")).toBe(`a,b,c,d`);
    },
  ],
  [
    "Object.clean: 10",
    function (expect) {
      const x = { a: 10, b: null, c: undefined, d: 0, e: "", f: "   " };
      const result = x.clean("whitespace");

      expect(Object.keys(result).join(",")).toBe(`a,b,c,d`);
    },
  ],
  [
    "Object.clean: 11",
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
      const result = x.clean("all");

      expect(Object.keys(result).join(",")).toBe(`a`);
    },
  ],
  [
    "Object.clean: 12",
    function (expect) {
      const x = {
        a: 10,
        b: { x: null },
        c: [{ n: 0 }, { n: 10, m: '' }, null, {}],
        d: { m: { p: '   ' } },
      };
      const result = x.clean("all");

      expect(Object.keys(result).join(",")).toBe(`a,c`);
      expect(result.c).toBeDefined();
      expect(result.c).toBeArray();
      expect(result.c.length).toBe(1);
      expect(Object.keys(result.c[0]).join(",")).toBe("n");
    },
  ],
];

export default tests;
