var repository = require('../repositories/Repository.js').Branch;

//---------------------- Branch ------------------------------//

exports.read = function(object, callback) {
	repository.read(object, callback);
}

exports.insert = function(object, options, callback) {
	repository.insert(object, options, callback);
}

exports.update = function(query, object, options, callback) {
	repository.update(query, object, options, callback);
}

exports.remove = function(object, options, callback) {
	repository.remove(object, options, callback);
}