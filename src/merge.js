import {
  isObject,
  isNullOrEmpty,
  foreach,
  isNullOrUndefined,
} from "@locustjs/base";

//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
const merge = function (target, ...sources) {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();
  if (isNullOrEmpty(target)) {
    target = isNullOrUndefined(source) ? null : {};
  }

  foreach(source, ({ key, value }) => {
    if (isObject(value)) {
      if (isNullOrUndefined(target[key])) {
        target[key] = {};
      }

      merge(target[key], value);
    } else {
      Object.assign(target, { [key]: value });
    }
  });

  return merge(target, ...sources);
};

export default merge;
