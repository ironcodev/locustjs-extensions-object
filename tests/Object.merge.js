import { configureObjectExtensions } from "../src";

configureObjectExtensions("merge");

const tests = [
  [
    "Object.merge: 3",
    function (expect) {
      const x = { a: 10 };
      const result = x.merge({ b: true });

      expect(JSON.stringify(result)).toBe('{"a":10,"b":true}');
    },
  ],
  [
    "Object.merge: 4",
    function (expect) {
      const x = { name: "John" };
      const a = { a: 10 };
      const b = { b: "test" };

      const result = x.merge(a, b);

      expect(JSON.stringify(result)).toBe('{"name":"John","a":10,"b":"test"}');
    },
  ],
  [
    "Object.merge: 5",
    function (expect) {
      const x = {
        person: {
          name: "ali",
        },
      };
      const result = x.merge({
        person: {
          age: 23,
        },
      });

      expect(JSON.stringify(result)).toBe('{"person":{"name":"ali","age":23}}');
    },
  ],
];

export default tests;
