import { isArray, isSomeObject, isSomeString } from "@locustjs/base";

const unflatten = function (obj, separator = ".") {
  let result;

  separator = isSomeString(separator) ? separator : ".";

  if (isArray(obj)) {
    result = [];

    for (let item of obj) {
      result.push(unflatten(item, separator));
    }
  } else if (isSomeObject(obj)) {
    result = {};

    for (let key of Object.keys(obj)) {
      let index = key.indexOf(separator);

      if (index < 0) {
        result[key] = unflatten(obj[key], separator);
      } else {
        let prevIndex = 0;
        let prevObj = result;

        while (index >= 0) {
          let subKey = key.substring(prevIndex, index);

          if (!prevObj[subKey]) {
            prevObj[subKey] = {};
          }

          prevIndex = index + 1;
          prevObj = prevObj[subKey];
          index = key.indexOf(separator, index + 1);
        }

        prevObj[key.substr(prevIndex)] = unflatten(obj[key], separator);
      }
    }
  } else {
    result = obj;
  }

  return result;
};

export default unflatten;
