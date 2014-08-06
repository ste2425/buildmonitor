exports.standardQueryProperties = function(req){
	for (var key in req.query)
	{ 
		if(isUpperCase(key)){
			req.query[key.toLowerCase()] = req.query[key];
			delete req.query[key];
		}
	}
	return req;
}

function isUpperCase(string){
	return string.match(/[A-Z]/);
}

exports.Format = function() {
    var s = arguments[0];
    for(var i = 0; i < arguments.length -1; i++) {
        var reg = new RegExp("\\{" + (i) + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

exports.isEmpty = function(object){
    for(var prop in object){
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
          return false;
        }
    }
    return true;
}

exports.group = function( arr, by ) {
    var groups = {},
        group,
        values,
        i = arr.length,
        j,
        key,
        group_keys,
        out = [];

    // make sure we specified how we want it grouped
    if( !by ) { return arr; }
    while( i-- ) { 

        // find out group values for this item
        values = ( typeof(by) === "function" && by( arr[i] ) || 
                   typeof arr[i] === "object" && arr[i][by] || 
                   arr[i] );

        // make sure our group values are an array
        values = values instanceof Array && values || [ values ];

        // recursively group
        group = groups;
        for( j = 0; j < values.length; j++ ) {
            key = values[j];
            group = ( group [key] || ( group [key] = j === values.length - 1 && [] || {} ) );
            if(group.comment){
                console.log(group);
            }
        }

        // for the last group, push the actual item onto the array
        group = ( group instanceof Array && group || [] ).push( arr[i] );
    }

    return groups;
};