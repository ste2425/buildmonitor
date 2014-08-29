app.controller('controller', function($scope, $http, $route, $timeout, service) {

    $scope.init = function() {
        $scope.setBuildObject();
        $scope.getBuilds();
        flashWarning('warning1', 900);
        flashWarning('warning2', 900);
    }

    function flashWarning(className, speed) {
        $('.' + className).animate({
            backgroundColor: "rgba(211, 65, 65, 0.7)"
        }, speed, function() {
            $('.' + className).animate({
                backgroundColor: "rgba(0, 0, 0, 0)"
            }, speed, function() {
                flashWarning(className, speed);
            });
        });
    }
    $scope.setBuildObject = function() {
        $scope.Display = {
            Count: {
                All: 0,
                Success: 0,
                Fail: 0
            },
            Today: {
                Queue: 0,
                Average: 0,
                Success: 0,
                Fail: 0
            },
            Yesterday: {
                Queue: 0,
                Average: 0,
                Success: 0,
                Fail: 0
            },
            Week: {
                Queue: 0,
                Average: 0,
                Success: 0,
                Fail: 0
            },
            Agents: [],
            AgentErrors: [],
            ShowWarning: false,
            Run: ''
        }
    }
    $scope.getBuilds = function() {
        service.getBuilds(function(err, data) {
            if (!err) {
                $scope.Display.ShowWarning = false;
                $scope.Display.Today.Queue = calcAvg(data.Data.Today.SUCCESS, true);
                $scope.Display.Today.Average = calcAvg(data.Data.Today.SUCCESS);
                $scope.Display.Today.Success = data.Data.Today.SUCCESS.length;
                $scope.Display.Today.Fail = data.Data.Today.FAILURE.length;

                $scope.Display.Yesterday.Queue = calcAvg(data.Data.Yesterday.SUCCESS, true);
                $scope.Display.Yesterday.Average = calcAvg(data.Data.Yesterday.SUCCESS);
                $scope.Display.Yesterday.Success = data.Data.Yesterday.SUCCESS.length;
                $scope.Display.Yesterday.Fail = data.Data.Yesterday.FAILURE.length;

                $scope.Display.Week.Queue = calcAvg(data.Data.SevenDays.SUCCESS, true);
                $scope.Display.Week.Average = calcAvg(data.Data.SevenDays.SUCCESS);
                $scope.Display.Week.Success = data.Data.SevenDays.SUCCESS.length;
                $scope.Display.Week.Fail = data.Data.SevenDays.FAILURE.length;

                $scope.Display.Count.All = data.Count.Total;
                $scope.Display.Count.Success = data.Count.TotalSuccess;
                $scope.Display.Count.Fail = data.Count.TotalFail;

                $scope.Display.Agents = data.Agents
                $scope.Display.Run = data.Data.Run;
                
                $scope.Display.Agents.forEach(function(item, i, arr) {
                    //Build agent errors
                    if (!item.enabled || !item.connected || !item.authorized || !item.uptodate) {
                        $scope.Display.ShowWarning = true;
                        arr[i].error = true;
                    }
                });
            } else {
                $scope.setBuildObject();
            }
            $timeout($scope.getBuilds, 30000);
        })
    }

    $scope.init();
});

function calcAvg(items, t) {
    if (items.length > 0) {
        var start = 'startDate';
        var stop = 'finishDate';
        var avg = 0;
        if (t) {
            start = 'queuedDate';
            stop = 'startDate';
        }
        for (var i in items) {
            var d = moment(items[i][stop]).diff(moment(items[i][start]))
            avg += d;
        }
        avg = avg / items.length;
        d = moment.duration(avg);
        return Math.floor(d.asHours()) + moment.utc(avg).format(":mm:ss");
    } else {
        return 'Rock - Hard Place';
    }
}