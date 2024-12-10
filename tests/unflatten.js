import { unflatten } from "../index.esm.js";

const tests = [
  [
    "unflatten: 1",
    function (expect) {
      const x = {
        name: "John",
        "address.city.id": 10,
        "address.city.name": "Tehran",
        "address.zip": "12345678",
      };
      const result = unflatten(x);

      expect(Object.keys(result).join(",")).toBe(`name,address`);
      expect(result.address).toBeObject();
      expect(Object.keys(result.address).join(",")).toBe("city,zip");
      expect(result.address.city).toBeObject();
      expect(Object.keys(result.address.city).join(",")).toBe("id,name");
    },
  ],
];

export default tests;
