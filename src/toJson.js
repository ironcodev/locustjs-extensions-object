import clean from "./clean";

function toJson(obj, filter, replacer, space) {
  if (filter === undefined) {
    filter = "";
  }

  return JSON.stringify(clean(obj, filter), replacer, space);
}

export default toJson;
