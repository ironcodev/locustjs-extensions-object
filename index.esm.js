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

const objectifyProps = function(object) {
	let result;
	
	if (isSomeObject(object)) {
		if (isArray(object)) {
			result = [];
			
			for (let item of object) {
				result.push(objectifyProps(item));
			}
		} else {
			result = {}
			
			for (let key of Object.keys(object)) {
				let dotIndex = key.indexOf('.');
				
				if (dotIndex < 0) {
					result[key] = object[key];
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
					
					prevObj[key.substr(prevIndex)] = object[key];
				}
			}
		}
	} else {
		result = object;
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
}

export default configureObjectExtensions

export {
	deepAssign,
	objectifyProps
}