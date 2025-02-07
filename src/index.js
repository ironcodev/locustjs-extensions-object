import {
  foreach,
  isSomeString,
  isSubClassOf,
  query,
  set,
} from "@locustjs/base";
import ExtensionHelper from "@locustjs/extensions-options";
import clean from "./clean";
import flatten from "./flatten";
import merge from "./merge";
import toArray from "./toArray";
import toJson from "./toJson";
import unflatten from "./unflatten";

function configureObjectExtensions(options, logger) {
  const eh = new ExtensionHelper(options, logger);

  eh.extend(Function, "isSubClassOf", function (parent) {
    return isSubClassOf(this, parent);
  });
  eh.extend(Object, "clean", function (filter) {
    return clean(this, filter);
  });
  eh.extend(Object, "clean", clean, true);

  eh.extend(Array, "clean", function (filter) {
    return clean(this, filter);
  });
  eh.extend(Array, "clean", clean, true);

  eh.extend(Object, "toJson", function (...args) {
    return toJson(this, ...args);
  });

  eh.extend(Object, "merge", function (...args) {
    return merge(this, ...args);
  });

  eh.extend(Object, "foreach", function (callback) {
    return foreach(this, callback);
  });
  eh.extend(Object, "foreach", foreach, true);

  eh.extend(Object, "flatten", function (separator) {
    return flatten(this, separator);
  });

  eh.extend(Object, "unflatten", function (separator) {
    return unflatten(this, separator);
  });

  eh.extend(Object, "toArray", function (type) {
    return toArray(this, type);
  });

  eh.extend(Object, "query", function (path) {
    return query(this, path);
  });
  eh.extend(Object, "query", query, true);

  eh.extend(Object, "set", function (path) {
    return set(this, path);
  });
  eh.extend(Object, "set", set, true);

  if (eh.shouldExtend("keys")) {
    const _keys = Object.keys;

    Object.keys = function (x, separator) {
      if (isSomeString(separator)) {
        return _keys(x).join(separator);
      } else {
        return _keys(x);
      }
    };

    eh._log(`${fnName} extended.`);
  }
}

export {
  configureObjectExtensions,
  merge,
  flatten,
  unflatten,
  toArray,
  clean,
  toJson,
  query,
  set,
  foreach,
};
