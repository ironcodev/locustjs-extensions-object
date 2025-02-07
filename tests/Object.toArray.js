import { configureObjectExtensions } from "../src";

configureObjectExtensions("toArray");

const tests = [
  [
    "Object.toArray: 1",
    function (expect) {
      const x = {
        name: "John",
        age: 23,
        active: true,
      };
      const result = x.toArray("key/value");

      expect(result).toBeArray();
      expect(result.length).toBe(3);

      expect(result[0]).toBeArray();
      expect(result[0].length).toBe(2);
      expect(result[0][0]).toBe("name");
      expect(result[0][1]).toBe("John");

      expect(result[1]).toBeArray();
      expect(result[1].length).toBe(2);
      expect(result[1][0]).toBe("age");
      expect(result[1][1]).toBe(23);

      expect(result[2]).toBeArray();
      expect(result[2].length).toBe(2);
      expect(result[2][0]).toBe("active");
      expect(result[2][1]).toBe(true);
    },
  ],
  [
    "Object.toArray: 2",
    function (expect) {
      const x = {
        name: "John",
        address: {
          city: { id: 10, name: "Tehran" },
          zip: "12345678",
        },
      };
      const result = x.toArray("key/value");

      expect(result).toBeArray();
      expect(result.length).toBe(2);

      expect(result[0]).toBeArray();
      expect(result[0].length).toBe(2);
      expect(result[0][0]).toBe("name");
      expect(result[0][1]).toBe("John");

      expect(result[1]).toBeArray();
      expect(result[1].length).toBe(2);
      expect(result[1][0]).toBe("address");
      expect(result[1][1]).toBeArray();
      expect(result[1][1].length).toBe(2);
      expect(result[1][1][0]).toBeArray();
      expect(result[1][1][0].length).toBe(2);
      expect(result[1][1][0][0]).toBe("city");
      expect(result[1][1][0][1]).toBeArray();
      expect(result[1][1][0][1].length).toBe(2);
      expect(result[1][1][0][1][0]).toBeArray();
      expect(result[1][1][0][1][0].length).toBe(2);
      expect(result[1][1][0][1][0][0]).toBe("id");
      expect(result[1][1][0][1][0][1]).toBe(10);
      expect(result[1][1][0][1][1]).toBeArray();
      expect(result[1][1][0][1][1].length).toBe(2);
      expect(result[1][1][0][1][1][0]).toBe("name");
      expect(result[1][1][0][1][1][1]).toBe("Tehran");
      expect(result[1][1][1]).toBeArray();
      expect(result[1][1][1][0]).toBe("zip");
      expect(result[1][1][1][1]).toBe("12345678");
    },
  ],
  [
    "Object.toArray: 3",
    function (expect) {
      const x = {
        name: "John",
        age: 23,
        active: true,
      };
      const result = x.toArray("keys");

      expect(result).toBeArray();
      expect(result.length).toBe(3);
      expect(result.join(",")).toBe("name,age,active");
    },
  ],
  [
    "Object.toArray: 4",
    function (expect) {
      const x = {
        name: "John",
        age: 23,
        active: true,
      };
      const result = x.toArray("values");

      expect(result).toBeArray();
      expect(result.length).toBe(3);
      expect(result.join(",")).toBe("John,23,true");
    },
  ],
];

export default tests;
