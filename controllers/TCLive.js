var util = require('../Custom_Modules/TCLive/index.js');
var config = require('../config.js');
var fs = require('fs');
var moment = require('moment');


//------------- Error Logging --------------------------------------//
function writeErrorLog(error) {
    var data = "-------------------------------\n";
    data += 'Time: ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    data += '\n\n';
    data += 'Error Message: ' + JSON.stringify(error, null, 2) + '\n';
    data += "-----------------------------------\n";

    fs.mkdir('errors', function (e) {
        if (!e || e.code == 'EEXIST') {
            fs.mkdir('errors/tclive', function (e) {
                if (!e || e.code == 'EEXIST') {
                    fs.appendFile('errors/tclive/error.txt', data);
                } else {
                    console.log(e)
                }
            })
        } else {
            console.log(e)
        }
    })
}