//Module dependencies.
var express = require('express'),
  routes = require('./routes'),
  app = express(),
  TCLive = require('./Custom_Modules/TCLive/index.js');

// all environments
app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({secret:'123abc',key:'express.sid'}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(express.logger('dev'));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Routes

//Pages
app.get('/',function(req,res){
  res.render('index');
});

//api
app.get('/find', function(req, res){
  TCLive.findBuildsToAdd(function(err, data){
    res.status(err ? 500 : 200).send(err || data);
  }, true)
});

app.get('/read', function(req, res){
  TCLive.getBuilds(function(err, data){
    res.status(err ? 500 : 200).send(err || data);
  });
})

app.listen(process.env.PORT || 3005);