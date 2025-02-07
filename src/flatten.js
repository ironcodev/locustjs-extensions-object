import { isArray, isSomeObject, isSomeString } from "@locustjs/base";

function _flatten(obj, separator = ".", prefix = "", result) {
  if (isArray(obj)) {
    result = [];

    for (let item of obj) {
      result.push(_flatten(item, separator));
    }
  } else if (isSomeObject(obj)) {
    if (!result) {
      result = {};
    }

    for (let key of Object.keys(obj)) {
      let _prefix = prefix ? prefix + separator + key : key;
      const value = obj[key];

      if (isArray(value)) {
        let r = [];

        for (let item of value) {
          r.push(_flatten(item, separator));
        }

        result[_prefix] = r;
      } else if (isSomeObject(value)) {
        _flatten(value, separator, _prefix, result);
      } else {
        result[_prefix] = value;
      }
    }
  } else {
    result = obj;
  }

  return result;
}

const flatten = function (obj, separator = ".") {
  separator = isSomeString(separator) ? separator : ".";

  let result = _flatten(obj, separator);

  return result;
};

export default flatten;
