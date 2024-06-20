import { isObject, forEach, isSubClassOf, isArray, isSomeObject, isSomeString, isString, isFunction, isNumber, isPrimitive } from "@locustjs/base";
import ExtensionHelper from "@locustjs/extensions-options";

//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
const merge = function (target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (target[key] === undefined) {
          target[key] = {};
        }
        merge(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return merge(target, ...sources);
};
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
        result[key] = obj[key];
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
        prevObj[key.substr(prevIndex)] = obj[key];
      }
    }
  } else {
    result = obj;
  }
  return result;
};
function toArrayKeyValue(obj) {
  let result = [];
  for (let key of Object.keys(obj)) {
    if (isObject(obj[key])) {
      result.push([key, toArrayKeyValue(obj[key])]);
    } else {
      result.push([key, obj[key]]);
    }
  }
  return result;
}
function toArrayValues(obj) {
  let result = [];
  for (let key of Object.keys(obj)) {
    if (isObject(obj[key])) {
      result.push(toArrayValues(obj[key]));
    } else {
      result.push(obj[key]);
    }
  }
  return result;
}
function toArraySchema(obj) {
  let result = [];
  for (let key of Object.keys(obj)) {
    if (isObject(obj[key])) {
      result.push([key, toArraySchema(obj[key])]);
    } else {
      result.push(key);
    }
  }
  return result;
}
function toArray(obj, type) {
  let result = [];
  if (isObject(obj)) {
    switch (type) {
      case "keyvalue":
      case "key/value":
      case "key-value":
        result = toArrayKeyValue(obj);
        break;
      case "values":
        result = toArrayValues(obj);
        break;
      case "keys":
      case "schema":
        result = toArraySchema(obj);
        break;
    }
  }
  return result;
}
function _clean(obj, filter) {
  let result;
  if (isPrimitive(obj)) {
    result = obj;
  } else {
    if (isArray(obj)) {
      result = [];
      obj.forEach(item => {
        if (!filter(item)) {
          const newItem = _clean(item, filter);
          if (!filter(newItem)) {
            result.push(newItem);
          }
        }
      });
    } else if (isObject(obj)) {
      result = {};
      Object.keys(obj).forEach(key => {
        if (!filter(obj[key])) {
          const item = _clean(obj[key], filter);
          if (!filter(item)) {
            result[key] = item;
          }
        }
      });
    }
  }
  return result;
}
function clean(obj, filter) {
  let _filter;
  if (isString(filter)) {
    const types = filter.toLowerCase().split(",").map(x => x.trim());
    const all = types.indexOf("all") >= 0;
    const nulls = types.indexOf("null") >= 0;
    const undefineds = types.indexOf("undefined") >= 0;
    const empty_array = types.indexOf("empty_array") >= 0;
    const empty_object = types.indexOf("empty_object") >= 0;
    const empty_string = types.indexOf("empty_string") >= 0;
    const white_string = types.indexOf("white_string") >= 0;
    const nan = types.indexOf("nan") >= 0;
    const zero_number = types.indexOf("zero_number") >= 0;
    const null_or_empty = nulls || undefineds;
    _filter = value => value === null && (all || null_or_empty || nulls) || value === undefined && (all || null_or_empty || undefineds) || isArray(value) && value.length == 0 && (all || empty_array) || isObject(value) && Object.keys(value).length == 0 && (all || empty_object) || isString(value) && value.length == 0 && (all || empty_string) || isString(value) && value.trim().length == 0 && (all || white_string) || isNumber(value) && isNaN(value) && (all || null_or_empty || nan) || isNumber(value) && value == 0 && (all || zero_number);
  } else if (isFunction(filter)) {
    _filter = filter;
  } else {
    _filter = () => false;
  }
  return _clean(obj, _filter);
}
function toJson(obj, replacer, space, filter) {
  return JSON.stringify(clean(obj, filter), replacer, space);
}
function configureObjectExtensions(options) {
  const eh = new ExtensionHelper(options, console);
  eh.extend(Function, "isSubClassOf", function (parent) {
    return isSubClassOf(this, parent);
  });
  eh.extend(Object, "clean", function (filter) {
    return clean(this, filter);
  });
  eh.extend(Object, "toJson", function (...args) {
    return toJson(this, ...args);
  });
  eh.extend(Object, "merge", function (...args) {
    merge(this, ...args);
  });
  eh.extend(Object, "forEach", function (callback) {
    return forEach(this, callback);
  });
  eh.extend(Object, "flatten", function (separator) {
    return flatten(this, separator);
  });
  eh.extend(Object, "unflatten", function (separator) {
    return unflatten(this, separator);
  });
  eh.extend(Object, "toArray", function (type) {
    return toArray(this, type);
  });
}
export default configureObjectExtensions;
export { merge, flatten, unflatten, toArray, clean, toJson };
