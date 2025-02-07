import { isObject } from "@locustjs/base";

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

export default toArray;
