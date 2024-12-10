import test1 from "./merge";
import test2 from "./toJson";
import test3 from "./clean";
import test4 from "./flatten";
import test5 from "./unflatten";
import test6 from "./query";
import test7 from "./toArray";
import TestRunner from "@locustjs/test";

const tests = [
  ...test1,
  ...test2,
  ...test3,
  ...test4,
  ...test5,
  ...test6,
  ...test7,
];

TestRunner.start(tests);
