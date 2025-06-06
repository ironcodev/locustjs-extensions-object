import { flatten } from "../src";

const tests = [
  [
    "flatten: 1",
    function (expect) {
      const x = {
        name: "John",
        address: {
          city: { id: 10, name: "Tehran" },
          zip: "12345678",
        },
      };
      const result = flatten(x);

      expect(Object.keys(result).join(",")).toBe(
        `name,address.city.id,address.city.name,address.zip`
      );
    },
  ],
  [
    "flatten: 2",
    function (expect) {
      const x = {
        name: "John",
        info: {
          scores: [
            { exam: { id: 100, name: "Mathematics I" }, score: "A" },
            { exam: { id: 102, name: "Physics I" }, score: "B" },
          ],
        },
      };
      const result = flatten(x);
/*
    {
      name: 'John',
      'info.scores': [
        { 'exam.id': 100, 'exam.name': 'Mathematics I', score: 'A' },
        { 'exam.id': 102, 'exam.name': 'Physics I', score: 'B' }
      ]
    }
*/
      expect(Object.keys(result).join(",")).toBe(`name,info.scores`);
      expect(result["info.scores"]).toBeArray();
      expect(result["info.scores"][0]).toBeObject();
      expect(Object.keys(result["info.scores"][0]).join(",")).toBe(
        "exam.id,exam.name,score"
      );
    },
  ],
];

export default tests;
