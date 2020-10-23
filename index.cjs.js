"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = exports.objectifyProps = exports.deepAssign = exports.default = void 0;

var _locustjsBase = require("locustjs-base");

var _locustjsExtensionsOptions = require("locustjs-extensions-options");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
var deepAssign = function deepAssign(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if (!sources.length) return target;
  var source = sources.shift();

  if ((0, _locustjsBase.isObject)(target) && (0, _locustjsBase.isObject)(source)) {
    for (var key in source) {
      if ((0, _locustjsBase.isObject)(source[key])) {
        if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
        deepAssign(target[key], source[key]);
      } else {
        Object.assign(target, _defineProperty({}, key, source[key]));
      }
    }
  }

  return deepAssign.apply(void 0, [target].concat(sources));
};

exports.deepAssign = deepAssign;

var objectifyProps = function objectifyProps(obj) {
  var result;

  if ((0, _locustjsBase.isSomeObject)(obj)) {
    if ((0, _locustjsBase.isArray)(obj)) {
      result = [];

      var _iterator = _createForOfIteratorHelper(obj),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          result.push(objectifyProps(item));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      result = {};

      for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        var dotIndex = key.indexOf('.');

        if (dotIndex < 0) {
          result[key] = obj[key];
        } else {
          var prevIndex = 0;
          var prevObj = result;

          while (dotIndex >= 0) {
            var subKey = key.substring(prevIndex, dotIndex);

            if (!prevObj[subKey]) {
              prevObj[subKey] = {};
            }

            prevIndex = dotIndex + 1;
            prevObj = prevObj[subKey];
            dotIndex = key.indexOf('.', dotIndex + 1);
          }

          prevObj[key.substr(prevIndex)] = obj[key];
        }
      }
    }
  } else {
    result = obj;
  }

  return result;
};

exports.objectifyProps = objectifyProps;

var toArray = function toArray(obj) {
  var result;

  if ((0, _locustjsBase.isArray)(obj)) {
    var arr = [];

    var _iterator2 = _createForOfIteratorHelper(obj),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        arr.push(toArray(item));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    result = [arr];
  } else if ((0, _locustjsBase.isObject)(obj)) {
    result = [];

    for (var _i2 = 0, _Object$keys2 = Object.keys(obj); _i2 < _Object$keys2.length; _i2++) {
      var key = _Object$keys2[_i2];
      result.push(key);
      result.push(toArray(obj[key]));
    }
  } else {
    result = obj;
  }

  return result;
};

exports.toArray = toArray;

function configureObjectExtensions(options) {
  var _options = (0, _locustjsExtensionsOptions.configureOptions)(options);

  if (typeof Object.prototype.isSubClassOf == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('isSubClassOf', _options)) {
    Object.prototype.isSubClassOf = function (parent) {
      return (0, _locustjsBase.isSubClassOf)(this, parent);
    };
  }

  if (typeof Object.prototype.toJson == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('toJson', _options)) {
    Object.prototype.toJson = function () {
      var replacer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var space = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return JSON.stringify(this, relacer, space);
    };
  }

  if (typeof Object.deepAssign == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('deepAssign', _options)) {
    Object.deepAssign = deepAssign;
  }

  if (typeof Object.prototype.forEach == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('forEach', _options)) {
    Object.prototype.forEach = function (callback) {
      return (0, _locustjsBase.forEach)(this, callback);
    };
  }

  if (typeof Object.prototype.objectifyProps == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('objectifyProps', _options)) {
    Object.prototype.objectifyProps = function () {
      return objectifyProps(this);
    };
  }

  if (typeof Object.prototype.toArray == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('toArray', _options)) {
    Object.prototype.toArray = function () {
      return toArray(this);
    };
  }
}

var _default = configureObjectExtensions;
exports.default = _default;