var http = require("http");
var querystring = require('querystring');
var parseString = require('xml2js').parseString;
var utilities = require('./../utilities/index');
var config = require('./../../config.js');
var mongo = require('./../../controllers/MongoDb');
var async = require('async');
var moment = require('moment');
var run = '';

exports.getBuilds = function(callback) {
	//Return all builds from database.
	mongo.readBuild({}, function(err, data) {
		if (!err) {
			var t = data.Data.length,
				ts = 0,
				tf = 0,
				day = [],
				yesterday = [],
				week = [];
			//Get build count
			for (var i in data.Data) {
				if (data.Data[i].status == 'SUCCESS') {
					ts++;
				} else if (data.Data[i].status == 'FAILURE') {
					tf++;
				}
			}
			//filter builds by age
			data.Data.forEach(function(item) {
				var diff = moment().diff(moment(item.startDate, 'YYYY/MM/DD'), 'days');
				if (diff == 0 || diff < 7) {
					week.push(item);
					if (diff == 0) {
						day.push(item);
					} else if (diff == 1) {
						yesterday.push(item);
					}
				}
			});
			//group builds by status
			day = utilities.group(day, function(groupby) {
				return [groupby.status];
			});
			yesterday = utilities.group(yesterday, function(groupby) {
				return [groupby.status];
			});
			week = utilities.group(week, function(groupby) {
				return [groupby.status];
			});
		}
		callback(err, {
			Count: {
				Total: t,
				TotalSuccess: ts,
				TotalFail: tf
			},
			Data: {
				Today: day,
				Yesterday: yesterday,
				SevenDays: week,
				Run: run
			}
		});
	});
}
exports.findBuildsToAdd = _findBuildsToAdd;

function _findBuildsToAdd(callback, single) {
	var _StoredBuilds = [];
	var _ReturnedBuilds = [];

	async.series([

		function(cb) {
			//Get existing builds
			mongo.readBuild({}, function(err, builds) {
				if (err) {
					cb(err, null)
				} else {
					_StoredBuilds = builds.Data;
					cb();
				}
			});
		},
		function(cb) {
			//Get all builds from team city
			_GetBuilds(function(err, data) {
				if (err) {
					cb(err, null);
				} else {
					_ReturnedBuilds = data;
					cb();
				}
			});
		},
		function(cb) {
			//Get builds that are not in database
			_GetBuildsToAdd(_ReturnedBuilds, _StoredBuilds, function(builds) {
				//Add builds to database
				_AddBuilds(builds, function(err, data) {
					_ReturnedBuilds = data;
					cb();
				});
			});
		}
	], function(err, res) {
		if (!single) {
			setTimeout(_findBuildsToAdd, 60000);
		}
		run = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
		if (callback) {
			if (err) {
				callback({
					Error: err
				}, null);
			} else {
				callback(null, _ReturnedBuilds);
			}
		}
	});
}

function _GetBuildsToAdd(New, Existing, cb) {
	//Filter out existing builds and return builds to add
	New.Success = New.Success.filter(function(item) {
		for (var i in Existing) {
			if (item[0].number == Existing[i].number) {
				return false;
			}
		}
		return true;
	});

	New.Failure = New.Failure.filter(function(item) {
		for (var i in Existing) {
			if (item[0].number == Existing[i].number) {
				return false;
			}
		}
		return true;
	});

	cb(New);
}

function _AddBuilds(Builds, cb) {
	async.series([

		function(seriesCB) {
			//Get success build info
			async.map(Builds.Success, function(item, mapCB) {
				var Build = {
					number: null,
					branchName: null,
					startDate: null,
					queuedDate: null,
					finishDate: null,
					status: null
				};
				async.series([
					//Get full details for both stop and start build items 
					//and build complete build object.
					function(t) {
						_MakeGetUrlCall(item[0].href, function(err, data) {
							if (item[0].buildTypeId == 'bramley_PublishToStore') {
								Build.finishDate = convertDate(data.finishDate);
							} else if (item[0].buildTypeId == 'bramley_InitiateBuild') {
								Build.number = data.number;
								Build.branchName = data.branchName;
								Build.queuedDate = convertDate(data.queuedDate);
								Build.startDate = convertDate(data.startDate);
							}
							t();
						});
					},
					function(t) {
						_MakeGetUrlCall(item[1].href, function(err, data) {
							if (item[1].buildTypeId == 'bramley_PublishToStore') {
								Build.finishDate = convertDate(data.finishDate);
							} else if (item[1].buildTypeId == 'bramley_InitiateBuild') {
								Build.number = data.number;
								Build.branchName = data.branchName;
								Build.queuedDate = convertDate(data.queuedDate);
								Build.startDate = convertDate(data.startDate);
							}
							t();
						});
					}
				], function(err, d) {
					Build.status = 'SUCCESS';
					mapCB(null, Build);
				});
			}, function(err, res) {
				//Insert array of build objects.
				mongo.insertBuild(res, function(err, response) {
					seriesCB(null, res);
				})
			});
		},
		function(seriesCB) {
			//Get failed build info
			async.map(Builds.Failure, function(item, mapCB) {
				var Build = {
					number: null,
					branchName: null,
					startDate: null,
					queuedDate: null,
					finishDate: null,
					status: null
				};
				//Failed builds most likely don't have a finished build item.
				//So only get full information on the first item.
				_MakeGetUrlCall(item[0].href, function(err, data) {
					Build.number = data.number;
					Build.branchName = data.branchName;
					Build.status = 'FAILURE';
					Build.startDate = convertDate(data.startDate);
					mapCB(err, Build);
				});
			}, function(err, res) {
				//Insert array of build objects.
				mongo.insertBuild(res, function(err, response) {
					seriesCB(null, res);
				})
			});
		}
	], function(err, res) {
		cb(null, {
			Success: res[0],
			Failure: res[1]
		});
	});
}

function convertDate(t) {
	var dateRE = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/;
	var match = t.match(dateRE);
	var nums = [],
		item, date;
	if (match) {
		for (var i = 1; i < match.length; i++) {
			nums.push(match[i]);
		}
		//0: year, 1: month, 2: day, 3: hours, 4: min, 5: sec
		return nums[0] + "-" + nums[1] + "-" + nums[2] + "T" + nums[3] + ":" + nums[4] + ":" + nums[5];
	} else {
		return t;
	}
}

function _MakeGetUrlCall(url, callback) {
	var options = {
		host: "tclive",
		port: 8111,
		path: url,
		headers: {
			"Accept": "application/json"
		}
	}
	var data = "";
	http.get(options, function(response) {

		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end', function() {
			if (response.statusCode == 200) {
				callback(null, JSON.parse(data));
			} else {
				callback({
					Error: data
				}, null);
			}
		});
	}).on("error", function(e) {
		console.log("error", e.message);
		callback(e, null);
	});
}

function _GetBuilds(cb) {
	var weekAgo = moment().subtract('days', 7).format('YYYYMMDD');
	_MakeGetUrlCall("/guestAuth/app/rest/builds/?locator=count:10000,branch:default:any,sinceDate:" + weekAgo + "T100000%2b0400", function(err, response) {
		if (err) {
			cb(err, null);
		} else {
			var s = [];
			var f = [];
			var u = [];
			//group builds by status
			response = utilities.group(response.build, function(groupby) {
				return [groupby.status];
			});

			//Success
			//Remove build steps except start and stop
			var SUCCESS = response.SUCCESS.filter(function(item) {
				if (item.buildTypeId == 'bramley_PublishToStore' || item.buildTypeId == 'bramley_InitiateBuild') {
					return true;
				}
				return false;
			});

			//Group steps by version number
			SUCCESS = utilities.group(SUCCESS, function(groupby) {
				return [groupby.number];
			});

			//Failure
			//Remove build steps except start and stop
			var FAILURE = response.FAILURE.filter(function(item) {
				if (item.buildTypeId == 'bramley_PublishToStore' || item.buildTypeId == 'bramley_InitiateBuild') {
					return true;
				}
				return false;
			});
			//Group steps by version number
			FAILURE = utilities.group(FAILURE, function(groupby) {
				return [groupby.number];
			});

			//Remove Successfull build steps without matching start and stop.
			for (var i in SUCCESS) {
				if (SUCCESS[i].length < 2) {
					/*
					ToDo: Need to decide on a method of filtering successfull build items where rest of build items are not in queue.
  					 	  Then place them in the failed object if the build isn't active, IE other build item has failed.
					if (FAILURE[i]) {
						FAILURE[i].push(SUCCESS[i][0]);
					} else {
						FAILURE[i] = SUCCESS[i];
					}*/
					delete SUCCESS[i];
				}
			}
			for (var i in SUCCESS) {
				s.push(SUCCESS[i]);
			}
			for (var i in FAILURE) {
				f.push(FAILURE[i]);
			}

			cb(null, {
				Success: s,
				Failure: f
			});
		}
	});
}

_findBuildsToAdd();