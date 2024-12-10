import { query } from "../index.esm.js";

const tests = [
  [
    "query: 1",
    function (expect) {
      const x = {
        name: "John",
        address: {
          city: { id: 10, name: "Tehran" },
          zip: "12345678",
        },
      };

      expect(query(x, "name")).toBe("John");
      expect(query(x, "address")).toBeObject();
      expect(query(x, "address.city.id")).toBe(10);
      expect(query(x, "address.city.code")).toBeUndefined();
      expect(query(x, "address.city")).toBeObject();
      expect(query(x, "name.size")).toBeUndefined();
    },
  ],
];

export default tests;
