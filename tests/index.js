import test11 from "./merge";
import test12 from "./Object.merge";
import test21 from "./toJson";
import test22 from "./Object.toJson";
import test31 from "./clean";
import test32 from "./Object.clean";
import test41 from "./flatten";
import test42 from "./Object.flatten";
import test51 from "./unflatten";
import test52 from "./Object.unflatten";
import test71 from "./toArray";
import test72 from "./Object.toArray";
import { TestRunner } from "@locustjs/test";

const tests = [
  ...test11,
  ...test12,
  ...test21,
  ...test22,
  ...test31,
  ...test32,
  ...test41,
  ...test42,
  ...test51,
  ...test52,
  ...test71,
  ...test72,
];

TestRunner.start(tests);
