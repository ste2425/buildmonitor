var controllerBuilder = require('./controllerBuilder');

var branchService = require('../services/branchService');

var buildService = require('../services/buildService');

exports.Branch = new controllerBuilder(branchService);
exports.Builds = new controllerBuilder(buildService);