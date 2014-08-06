var monk = require('monk');

var repositoryBuilder = require('./repositoryBuilder.js');
var Database = monk('user:buildmonitor@localhost:27017/buildmonitor');

exports.Build = new repositoryBuilder(Database.get('buildCollection'));
exports.Branch = new repositoryBuilder(Database.get('branchCollection'));