module.exports = function(collectionObject) {
	this.read = function(object, callback) {
		collectionObject.find(object, function(err, docs) {
			if (err) {
				callback({
					ErrorMessage: err,
                    Stack: new Error().stack
				}, null);
			} else {
				callback(null, {
					Count: docs.length,
					Data: docs
				});
			}
		});
	};
	this.update = function(query, object, options, callback) {
		collectionObject.update(query, object, options, function(err, updatedNo) {
			if (err) {
				callback({
					ErrorMessage: err,
                    Stack: new Error().stack
				}, null);
			} else {
				callback(null, {
					Count: updatedNo,
					Updated: object
				});
			}
		});
	};
	this.insert = function(object, options, callback) {
		collectionObject.insert(object, options, function(err, records) {
			if (err) {
				callback({
					ErrorMessage: err,
                    Stack: new Error().stack
				}, null);
			} else {
				callback(null, {
					Count: records.length ? records.length : records ? 1 : 0,
					Inserted: records
				});
			}
		});
	};
	this.remove = function(object, options, callback) {
		collectionObject.remove(object, options, function(err, numberOfRemovedDocs) {
			if (err) {
				callback({
					ErrorMessage: err,
                    Stack: new Error().stack
				}, null);
			} else {
				callback(null, {
					Count: numberOfRemovedDocs,
					Removed: numberOfRemovedDocs > 0 ? object : null
				});
			}
		});
	};
}