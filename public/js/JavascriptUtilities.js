function errorsObject (data, status){
	this.ErrorMessage = data;
	this.Status = (status) ? status : 0;
}

Format = function() {
	var s = arguments[0];
	for(var i = 0; i < arguments.length -1; i++) {
		var reg = new RegExp("\\{" + (i) + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
}

function Defined(Object) {
    if (typeof Object === 'undefined' || Object === null || Object === "")
        return false;
    else
        return true;
}

isEmpty = function(object){
    for(var prop in object){
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
          return false;
        }
    }
    return true;
}