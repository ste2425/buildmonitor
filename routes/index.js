exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.admin = function(){
	return function(req, res){
		res.render('adminPage');
	}
}
exports.directoryfilelist = function(filedb, walk){
	return function(req, res){
		console.log(req.user);
			res.render('directoryfilelist',{
				locals: {
					user: req.user.username
				}
			});
	}
}
