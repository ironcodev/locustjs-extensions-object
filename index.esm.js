import { isObject, forEach, isSubClassOf, isArray, isSomeObject } from 'locustjs-base'
import { configureOptions, shouldExtend } from 'locustjs-extensions-options'

//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
const deepAssign = function (target, ...sources) {
	if (!sources.length) return target;

	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key])
					Object.assign(target, { [key]: {} });
				
				deepAssign(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepAssign(target, ...sources);
}
function _flatten(obj, separator = '.', prefix = '', result){
	if (isArray(obj)) {
		result = [];
		
		for (let item of obj) {
			result.push(_flatten(item, separator));
		}
	} else if (isSomeObject(obj)) {
		result = {};
			
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
  
const expand = function(obj, separator = '.') {
	let result;
	
	separator = isSomeString(separator) ? separator : '.';
	
	if (isArray(obj)) {
		result = [];
		
		for (let item of obj) {
			result.push(expand(item, separator));
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

const toArray = function (obj) {
	let result;
	
	if (isArray(obj)) {
		let arr = [];
		
		for (let item of obj) {
			arr.push(toArray(item));
		}
		
		result = [arr];
	} else if (isObject(obj)) {
		result = [];
		
		for (let key of Object.keys(obj)) {
			result.push(key);
			result.push(toArray(obj[key]))
		}
	} else {
		result = obj;
	}
	
	return result;
}

function configureObjectExtensions(options) {
	const _options = configureOptions(options);

	if (typeof Object.prototype.isSubClassOf == 'undefined' || shouldExtend('isSubClassOf', _options)) {
		Object.prototype.isSubClassOf = function (parent) {
			return isSubClassOf(this, parent);
		}
	}
	
	if (typeof Object.prototype.toJson == 'undefined' || shouldExtend('toJson', _options)) {
		Object.prototype.toJson = function (replacer = null, space = null) {
			return JSON.stringify(this, relacer, space)
		}
	}
	
	if (typeof Object.deepAssign == 'undefined' || shouldExtend('deepAssign', _options)) {
		Object.deepAssign = deepAssign;
	}
	
	if (typeof Object.prototype.forEach == 'undefined' || shouldExtend('forEach', _options)) {
		Object.prototype.forEach = function (callback) {
			return forEach(this, callback);
		}
	}
	
	if (typeof Object.prototype.flatten == 'undefined' || shouldExtend('flatten', _options)) {
		Object.prototype.flatten = function (separator) {
			return flatten(this, separator)
		}
	}
	
	if (typeof Object.prototype.expand == 'undefined' || shouldExtend('expand', _options)) {
		Object.prototype.expand = function (separator) {
			return expand(this, separator)
		}
	}
	
	if (typeof Object.prototype.toArray == 'undefined' || shouldExtend('toArray', _options)) {
		Object.prototype.toArray = function () {
			return toArray(this)
		}
	}
}

export default configureObjectExtensions

export {
	deepAssign,
	flatten,
	expand,
	toArray
}