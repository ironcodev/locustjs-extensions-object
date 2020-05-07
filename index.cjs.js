"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepAssign = exports.isSubClassOf = exports.default = void 0;

var _locustjsBase = require("locustjs-base");

var _locustjsExtensionsOptions = require("locustjs-extensions-options");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var isSubClassOf = function isSubClassOf(child, parent) {
  return _instanceof(child.prototype, parent) || child === parent;
}; //source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge


exports.isSubClassOf = isSubClassOf;

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

  return Object.deepAssign.apply(Object, [target].concat(sources));
};

exports.deepAssign = deepAssign;

function configureObjectExtensions(options) {
  var _options = (0, _locustjsExtensionsOptions.configureOptions)(options);

  if (typeof Object.prototype.isSubClassOf == 'undefined' || (0, _locustjsExtensionsOptions.shouldExtend)('isSubClassOf', _options)) {
    Object.prototype.isSubClassOf = function (parent) {
      return isSubClassOf(this, parent);
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
}

var _default = configureObjectExtensions;
exports.default = _default;