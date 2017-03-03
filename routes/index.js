var express = require('express');
var router = express.Router();

//get the homepage
router.get('/',function(req,res){
	res.render('index');
});
module.exports = router;




//after logging in
//router.get('/home', function(req, res){
//  res.render('home');
//});
