/*
    MongoDB Controller

    Description: Provides a thin wrapper to the MongoDb module, contains some very specific MongoDb methods
                 that may be used in multiple places. Also provides error logging to the following location:
                 'root/errors/mongodb/error.txt' Creating folders/files if non exist. 

    For more info on MongoDb module methods see readme.txt at root of MongoDbModule
*/
var util = require('../Custom_Modules/utilities/index.js');
var config = require('../config.js');
var mongo = require('../Custom_Modules/MongoDbModule/mongoIndex.js');
var fs = require('fs');
var moment = require('moment');

//------------ Branch Commands --------------------------//

exports.insertBranch = function (object, callback, options) {
    mongo.Branch.insert(object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}

exports.removeBranch = function (object, callback, options) {
    mongo.Branch.remove(object, function (err, data) {
        if (err) {
            writeErrorLog(err)
        }
        callback(err, data);
    }, options);
}

exports.readBranch = function (object, callback, options) {
    mongo.Branch.read(object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}

exports.updateBranch = function (query, object, callback, options) {
    mongo.Branch.update(query, object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}

//------------ Build Commands --------------------------//

exports.insertBuild = function (object, callback, options) {
    mongo.Builds.insert(object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}

exports.removeBuild = function (object, callback, options) {
    mongo.Builds.remove(object, function (err, data) {
        if (err) {
            writeErrorLog(err)
        }
        callback(err, data);
    }, options);
}

exports.readBuild = function (object, callback, options) {
    mongo.Builds.read(object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}

exports.updateBuild = function (query, object, callback, options) {
    mongo.Builds.update(query, object, function (err, data) {
        if (err) {
            writeErrorLog(err);
        }
        callback(err, data);
    }, options);
}


//------------- Error Logging --------------------------------------//
function writeErrorLog(error) {
    var data = "-------------------------------\n";
    data += 'Time: ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    data += '\n\n';
    data += 'Error Message: ' + JSON.stringify(error, null, 2) + '\n';
    data += "-----------------------------------\n";

    fs.mkdir('errors', function (e) {
        if (!e || e.code == 'EEXIST') {
            fs.mkdir('errors/mongodb', function (e) {
                if (!e || e.code == 'EEXIST') {
                    fs.appendFile('errors/mongodb/error.txt', data);
                } else {
                    console.log(e)
                }
            })
        } else {
            console.log(e)
        }
    })
}