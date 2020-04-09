import { isObject } from 'locust-base'

function configureObjectExtensions(options) {
	const _options = Object.assign({
		replaceExisting: true
	}, options);

	if (typeof Object.prototype.isSubClassOf == 'undefined' || _options.replaceExisting) {
		Object.prototype.isSubClassOf = function (parent) {
			return this.prototype instanceof parent || this === parent;
		}
	}
	
	if (typeof Object.prototype.toJson == 'undefined' || _options.replaceExisting) {
		Object.prototype.toJson = function (replacer = null, space = null) {
			return JSON.stringify(this, relacer, space)
		}
	}
	
	//source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	Object.deepAssign = function (target, ...sources) {
		if (!sources.length) return target;

		const source = sources.shift();

		if (isObject(target) && isObject(source)) {
			for (const key in source) {
				if (isObject(source[key])) {
					if (!target[key])
						Object.assign(target, { [key]: {} });
					
					Object.deepAssign(target[key], source[key]);
				} else {
					Object.assign(target, { [key]: source[key] });
				}
			}
		}

		return Object.deepAssign(target, ...sources);
	}
}

export default configureObjectExtensions()

