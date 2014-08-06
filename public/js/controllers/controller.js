app.controller('controller', function($scope,$http,$route, $timeout,fileListService){
    fileListService.getBuilds(function(err, data){
        if(!err){
            $scope.builds = data;
        }else{
            $scope.builds = [];
        }
    })
});


Date.prototype.FormatDate = function(){
  var dd=this.getDate();
  if(dd<10)dd='0'+dd;
  var mm=this.getMonth()+1;
  if(mm<10)mm='0'+mm;
  var yyyy=this.getFullYear();
  return String(dd+"-"+mm+"-"+yyyy);
}

function scroll(id, direction){  
 $('#' + id).animate({
        scrollLeft: direction + '=' + $('#' + id).width()
    }, 500);
}

function setSelectedColor(object){
    if(!$('#popup').is(":visible")){
        var elements = object.parentNode.childNodes;

        for(var i in elements){
            if(elements[i].className){
            elements[i].className = elements[i].className.replace('test', '');
            }
        }
        object.className += object.className ? ' test' : 'test';
    }
}

function addResizeListener() {
    resize();
    if (window.addEventListener)
        window.addEventListener("resize", resize, false);
    else
        document.body.onresize = resize;

}

function resize() {
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var height2 = (height - (document.getElementById("title").offsetHeight + document.getElementById("navigation").offsetHeight + 10));
    if (document.getElementById("mainTable")) {
        document.getElementById("mainTable").style.height = (height2 > 200) ? height2 + "px" : "200px";
    }
}

function displayTime(input) {
    var str = "";
    var currentTime;

    if(input){
        currentTime = new Date(Date.parse(input))
        var date = currentTime.getDate() + "/" + currentTime.getMonth() + "/" + currentTime.getFullYear();
    }else{
        currentTime = new Date()
    }
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += ((date) ? date : "") + " " + hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

