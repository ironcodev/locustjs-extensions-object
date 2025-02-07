import { configureObjectExtensions } from "../src";

configureObjectExtensions("unflatten");

const tests = [
  [
    "Object.unflatten: 1",
    function (expect) {
      const x = {
        name: "John",
        "address.city.id": 10,
        "address.city.name": "Tehran",
        "address.zip": "12345678",
      };
      const result = x.unflatten();

      expect(Object.keys(result).join(",")).toBe(`name,address`);
      expect(result.address).toBeObject();
      expect(Object.keys(result.address).join(",")).toBe("city,zip");
      expect(result.address.city).toBeObject();
      expect(Object.keys(result.address.city).join(",")).toBe("id,name");
    },
  ],
];

export default tests;
