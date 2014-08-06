module.exports = function(serviceObject) {

	this.read = function(object, callback, options) {
		serviceObject.read(object, callback);
	}

	this.update = function(query, object, callback, options) {
		serviceObject.update(query, {
			$set: object
		}, options, callback);
	}

	this.remove = function(object, callback, options) {
		options = (!argumentDefined(options) ? {
			w: 1
		} : options);

		if (!options.w) {
			options.w = 1;
		}

		serviceObject.remove(object, options, callback);
	}

	this.insert = function(object, callback, options) {
		options = (!argumentDefined(options) ? {
			safe: true
		} : options);
		if (!options.safe) {
			options.safe = true;
		}

		serviceObject.insert(object, options, callback);
	}
}

function argumentDefined(argument) {
	if (typeof argument === "undefined" || argument === null) {
		return false;
	}
	return true;
}