import {
  isObject,
  isArray,
  isString,
  isFunction,
  isNumber,
  isPrimitive,
  isNullOrEmpty,
} from "@locustjs/base";

function _clean(obj, filter) {
  let result;

  if (isPrimitive(obj)) {
    result = obj;
  } else {
    if (isArray(obj)) {
      result = [];

      obj.forEach((item) => {
        if (!filter(item)) {
          const newItem = _clean(item, filter);

          if (!filter(newItem)) {
            result.push(newItem);
          }
        }
      });
    } else if (isObject(obj)) {
      result = {};

      Object.keys(obj).forEach((key) => {
        if (!filter(obj[key])) {
          const item = _clean(obj[key], filter);

          if (!filter(item)) {
            result[key] = item;
          }
        }
      });
    } else {
      result = obj;
    }
  }

  return result;
}
function clean(obj, filter) {
  let _filter;

  if (filter === undefined) {
    filter = "null,undefined,nan,string,empty";
  }

  if (isString(filter)) {
    const types = filter
      .toLowerCase()
      .split(",")
      .map((x) => x.trim());
    const all = types.indexOf("all") >= 0;
    const nulls = types.indexOf("null") >= 0;
    const undefineds = types.indexOf("undefined") >= 0;
    const empty_array = types.indexOf("array") >= 0;
    const empty_object = types.indexOf("object") >= 0;
    const empty_string = types.indexOf("string") >= 0;
    const white_string = types.indexOf("whitespace") >= 0;
    const nan = types.indexOf("nan") >= 0;
    const zero_number = types.indexOf("zero") >= 0;
    const empty = types.indexOf("empty") >= 0;

    _filter = (value) =>
      (isNullOrEmpty(value) && (all || empty)) ||
      (value === null && (all || nulls)) ||
      (value === undefined && (all || undefineds)) ||
      (isArray(value) && value.length == 0 && (all || empty_array)) ||
      (isObject(value) &&
        value !== null &&
        Object.keys(value).length == 0 &&
        (all || empty_object)) ||
      (isString(value) && value.length == 0 && (all || empty_string)) ||
      (isString(value) && value.trim().length == 0 && (all || white_string)) ||
      (isNumber(value) && isNaN(value) && (all || nan)) ||
      (isNumber(value) && value == 0 && (all || zero_number));
  } else if (isFunction(filter)) {
    _filter = filter;
  }

  return _filter ? _clean(obj, _filter) : obj;
}
export default clean;
