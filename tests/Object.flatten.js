import { configureObjectExtensions } from "../src";

configureObjectExtensions('flatten')

const tests = [
  [
    "Object.flatten: 1",
    function (expect) {
      const x = {
        name: "John",
        address: {
          city: { id: 10, name: "Tehran" },
          zip: "12345678",
        },
      };
      const result = x.flatten();

      expect(Object.keys(result).join(",")).toBe(
        `name,address.city.id,address.city.name,address.zip`
      );
    },
  ],
];

export default tests;
