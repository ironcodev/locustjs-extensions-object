import { isObject, forEach, isSubClassOf, isArray, isSomeObject, isSomeString } from '@locustjs/base'
import ExtensionHelper from '@locustjs/extensions-options'

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
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return merge(target, ...sources);
}
function _flatten(obj, separator = '.', prefix = '', result) {
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
		result = obj
	}

	return result;
}

const flatten = function (obj, separator = '.') {
	separator = isSomeString(separator) ? separator : '.';

	let result = _flatten(obj, separator);

	return result;
}

const unflatten = function (obj, separator = '.') {
	let result;

	separator = isSomeString(separator) ? separator : '.';

	if (isArray(obj)) {
		result = [];

		for (let item of obj) {
			result.push(unflatten(item, separator));
		}
	} else if (isSomeObject(obj)) {
		result = {}

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
						prevObj[subKey] = {}
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
}

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
			case 'keyvalue':
			case 'key/value':
			case 'key-value':
				result = toArrayKeyValue(obj);

				break;
			case 'values':
				result = toArrayValues(obj);

				break;
			case 'keys':
			case 'schema':
				result = toArraySchema(obj);

				break;
		}
	}

	return result;
}

function configureObjectExtensions(options) {
	const eh = new ExtensionHelper(options, console);

	eh.extend(Object, 'isSubClassOf', function (parent) {
		return isSubClassOf(this, parent);
	});

	eh.extend(Object, 'toJson', function (replacer = null, space = null) {
		return JSON.stringify(this, replacer, space);
	});

	eh.extend(Object, 'merge', function(...args) {
		merge(this, ...args);
	});
	eh.extend(Object, 'forEach', function (callback) {
		return forEach(this, callback);
	});

	eh.extend(Object, 'flatten', function (separator) {
		return flatten(this, separator);
	});

	eh.extend(Object, 'unflatten', function (separator) {
		return unflatten(this, separator);
	});

	eh.extend(Object, 'toArray', function (type) {
		return toArray(this, type);
	});
}

export default configureObjectExtensions

export {
	merge,
	flatten,
	unflatten,
	toArray
}