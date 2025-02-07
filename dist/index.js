'use strict';

var base = require('@locustjs/base');
var ExtensionHelper = require('@locustjs/extensions-options');

function _clean(obj, filter) {
  var result;
  if (base.isPrimitive(obj)) {
    result = obj;
  } else {
    if (base.isArray(obj)) {
      result = [];
      obj.forEach(function (item) {
        if (!filter(item)) {
          var newItem = _clean(item, filter);
          if (!filter(newItem)) {
            result.push(newItem);
          }
        }
      });
    } else if (base.isObject(obj)) {
      result = {};
      Object.keys(obj).forEach(function (key) {
        if (!filter(obj[key])) {
          var item = _clean(obj[key], filter);
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
  var _filter;
  if (filter === undefined) {
    filter = "null,undefined,nan,string,empty";
  }
  if (base.isString(filter)) {
    var types = filter.toLowerCase().split(",").map(function (x) {
      return x.trim();
    });
    var all = types.indexOf("all") >= 0;
    var nulls = types.indexOf("null") >= 0;
    var undefineds = types.indexOf("undefined") >= 0;
    var empty_array = types.indexOf("array") >= 0;
    var empty_object = types.indexOf("object") >= 0;
    var empty_string = types.indexOf("string") >= 0;
    var white_string = types.indexOf("whitespace") >= 0;
    var nan = types.indexOf("nan") >= 0;
    var zero_number = types.indexOf("zero") >= 0;
    var empty = types.indexOf("empty") >= 0;
    _filter = function _filter(value) {
      return base.isNullOrEmpty(value) && (all || empty) || value === null && (all || nulls) || value === undefined && (all || undefineds) || base.isArray(value) && value.length == 0 && (all || empty_array) || base.isObject(value) && value !== null && Object.keys(value).length == 0 && (all || empty_object) || base.isString(value) && value.length == 0 && (all || empty_string) || base.isString(value) && value.trim().length == 0 && (all || white_string) || base.isNumber(value) && isNaN(value) && (all || nan) || base.isNumber(value) && value == 0 && (all || zero_number);
    };
  } else if (base.isFunction(filter)) {
    _filter = filter;
  }
  return _filter ? _clean(obj, _filter) : obj;
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (undefined !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : undefined;
  }
}

function _flatten(obj) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".";
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var result = arguments.length > 3 ? arguments[3] : undefined;
  if (base.isArray(obj)) {
    result = [];
    var _iterator = _createForOfIteratorHelper(obj),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        result.push(_flatten(item, separator));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (base.isSomeObject(obj)) {
    if (!result) {
      result = {};
    }
    for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      var _prefix = prefix ? prefix + separator + key : key;
      var value = obj[key];
      if (base.isArray(value)) {
        var r = [];
        var _iterator2 = _createForOfIteratorHelper(value),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _item = _step2.value;
            r.push(_flatten(_item, separator));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        result[_prefix] = r;
      } else if (base.isSomeObject(value)) {
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
var flatten = function flatten(obj) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".";
  separator = base.isSomeString(separator) ? separator : ".";
  var result = _flatten(obj, separator);
  return result;
};

//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
var _merge = function merge(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }
  if (!sources.length) {
    return target;
  }
  var source = sources.shift();
  if (base.isNullOrEmpty(target)) {
    target = base.isNullOrUndefined(source) ? null : {};
  }
  base.foreach(source, function (_ref) {
    var key = _ref.key,
      value = _ref.value;
    if (base.isObject(value)) {
      if (base.isNullOrUndefined(target[key])) {
        target[key] = {};
      }
      _merge(target[key], value);
    } else {
      Object.assign(target, _defineProperty({}, key, value));
    }
  });
  return _merge.apply(undefined, [target].concat(sources));
};

function toArrayKeyValue(obj) {
  var result = [];
  for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    if (base.isObject(obj[key])) {
      result.push([key, toArrayKeyValue(obj[key])]);
    } else {
      result.push([key, obj[key]]);
    }
  }
  return result;
}
function toArrayValues(obj) {
  var result = [];
  for (var _i2 = 0, _Object$keys2 = Object.keys(obj); _i2 < _Object$keys2.length; _i2++) {
    var key = _Object$keys2[_i2];
    if (base.isObject(obj[key])) {
      result.push(toArrayValues(obj[key]));
    } else {
      result.push(obj[key]);
    }
  }
  return result;
}
function toArraySchema(obj) {
  var result = [];
  for (var _i3 = 0, _Object$keys3 = Object.keys(obj); _i3 < _Object$keys3.length; _i3++) {
    var key = _Object$keys3[_i3];
    if (base.isObject(obj[key])) {
      result.push([key, toArraySchema(obj[key])]);
    } else {
      result.push(key);
    }
  }
  return result;
}
function toArray(obj, type) {
  var result = [];
  if (base.isObject(obj)) {
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

function toJson(obj, filter, replacer, space) {
  if (filter === undefined) {
    filter = "";
  }
  return JSON.stringify(clean(obj, filter), replacer, space);
}

var _unflatten = function unflatten(obj) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".";
  var result;
  separator = base.isSomeString(separator) ? separator : ".";
  if (base.isArray(obj)) {
    result = [];
    var _iterator = _createForOfIteratorHelper(obj),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        result.push(_unflatten(item, separator));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (base.isSomeObject(obj)) {
    result = {};
    for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      var index = key.indexOf(separator);
      if (index < 0) {
        result[key] = _unflatten(obj[key], separator);
      } else {
        var prevIndex = 0;
        var prevObj = result;
        while (index >= 0) {
          var subKey = key.substring(prevIndex, index);
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

function configureObjectExtensions(options, logger) {
  var eh = new ExtensionHelper(options, logger);
  eh.extend(Function, "isSubClassOf", function (parent) {
    return base.isSubClassOf(this, parent);
  });
  eh.extend(Object, "clean", function (filter) {
    return clean(this, filter);
  });
  eh.extend(Object, "clean", clean, true);
  eh.extend(Array, "clean", function (filter) {
    return clean(this, filter);
  });
  eh.extend(Array, "clean", clean, true);
  eh.extend(Object, "toJson", function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return toJson.apply(undefined, [this].concat(args));
  });
  eh.extend(Object, "merge", function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return _merge.apply(undefined, [this].concat(args));
  });
  eh.extend(Object, "foreach", function (callback) {
    return base.foreach(this, callback);
  });
  eh.extend(Object, "foreach", base.foreach, true);
  eh.extend(Object, "flatten", function (separator) {
    return flatten(this, separator);
  });
  eh.extend(Object, "unflatten", function (separator) {
    return _unflatten(this, separator);
  });
  eh.extend(Object, "toArray", function (type) {
    return toArray(this, type);
  });
  eh.extend(Object, "query", function (path) {
    return base.query(this, path);
  });
  eh.extend(Object, "query", base.query, true);
  eh.extend(Object, "set", function (path) {
    return base.set(this, path);
  });
  eh.extend(Object, "set", base.set, true);
  if (eh.shouldExtend("keys")) {
    var _keys = Object.keys;
    Object.keys = function (x, separator) {
      if (base.isSomeString(separator)) {
        return _keys(x).join(separator);
      } else {
        return _keys(x);
      }
    };
    eh._log("".concat(fnName, " extended."));
  }
}

Object.defineProperty(exports, "foreach", {
  enumerable: true,
  get: function () { return base.foreach; }
});
Object.defineProperty(exports, "query", {
  enumerable: true,
  get: function () { return base.query; }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () { return base.set; }
});
exports.clean = clean;
exports.configureObjectExtensions = configureObjectExtensions;
exports.flatten = flatten;
exports.merge = _merge;
exports.toArray = toArray;
exports.toJson = toJson;
exports.unflatten = _unflatten;
