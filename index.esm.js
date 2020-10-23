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

	return Object.deepAssign(target, ...sources);
}

const objectifyProps = function(obj) {
	let result;
	
	if (isSomeObject(obj)) {
		if (isArray(obj)) {
			result = [];
			
			for (let item of obj) {
				result.push(objectifyProps(item));
			}
		} else {
			result = {}
			
			for (let key of Object.keys(obj)) {
				let dotIndex = key.indexOf('.');
				
				if (dotIndex < 0) {
					result[key] = obj[key];
				} else {
					let prevIndex = 0;
					let prevObj = result;
					
					while (dotIndex >= 0) {
						let subKey = key.substring(prevIndex, dotIndex);
						
						if (!prevObj[subKey]) {
							prevObj[subKey] = {}
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
	
	if (typeof Object.prototype.objectifyProps == 'undefined' || shouldExtend('objectifyProps', _options)) {
		Object.prototype.objectifyProps = function () {
			return objectifyProps(this)
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
	objectifyProps,
	toArray
}