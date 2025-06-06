import { unflatten } from "../src";

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
  [
    "unflatten: 2",
    function (expect) {
      const x = {
        name: "John",
        "info.scores": [
          { "exam.id": 100, "exam.name": "Mathematics I", score: "A" },
          { "exam.id": 102, "exam.name": "Physics I", score: "B" },
        ],
      };
      const result = unflatten(x);
/*
      {
        name: "John",
        info: {
          scores: [
            { exam: { id: 100, name: "Mathematics I" }, score: "A" },
            { exam: { id: 102, name: "Physics I" }, score: "B" },
          ],
        },
      }
*/

      expect(Object.keys(result).join(",")).toBe(`name,info`);
      expect(result.info).toBeObject();
      expect(Object.keys(result.info).join(",")).toBe("scores");
      expect(result.info.scores).toBeArray();
      expect(result.info.scores.length).toBe(2);
      expect(result.info.scores[0]).toBeObject();
      expect(result.info.scores[0].exam).toBeObject();
      expect(Object.keys(result.info.scores[0].exam).join(",")).toBe("id,name");
    },
  ],
];

export default tests;
