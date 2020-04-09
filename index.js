import { isObject } from 'locust-base'

const isSubClassOf = (child, parent) => child.prototype instanceof parent || child === parent;
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

function configureObjectExtensions(options) {
	const _options = Object.assign({
		replaceExisting: true
	}, options);

	if (typeof Object.prototype.isSubClassOf == 'undefined' || _options.replaceExisting) {
		Object.prototype.isSubClassOf = function (parent) {
			return isSubClassOf(this, parent);
		}
	}
	
	if (typeof Object.prototype.toJson == 'undefined' || _options.replaceExisting) {
		Object.prototype.toJson = function (replacer = null, space = null) {
			return JSON.stringify(this, relacer, space)
		}
	}
	
	Object.deepAssign = deepAssign;
}

export default configureObjectExtensions()

export {
	isSubClassOf,
	deepAssign
}