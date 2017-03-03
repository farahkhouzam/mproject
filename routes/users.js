var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest: './public/uploads/', rename: function(fieldname,filename)
{
  return filename.replace(/\w+/g, '-').toLowerCase() +Date.now()
}});
var User = require('../models/student');
var ProjectController = require('../controller/ProjectController');
var PController = require('../controller/PController');


var bodyParser = require('body-parser');




// Register
router.get('/register', function(req, res){
  res.render('register');
});

// Login
router.get('/login', function(req, res){
  res.render('login');
});

// Register User
router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = new User({
      name: name,
      email:email,
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now login');

    res.redirect('/users/createP');
  }
});



//validation
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){

      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


//logging in
router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/home', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

//logging out
router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});

//after login (lazem azabatha)
router.get('/home',PController.getAllPortofolios);
//router.post('/home', ProjectController.createProject);
//router.get('/home', function(req, res){
//  res.render('home');
//});

//creating a portofolio
router.get('/createP', function(req, res){
  res.render('createP');
});
router.get('/explore',PController.getAllPortofolios);

router.post('/home' ,upload.any() , PController.createandsavePortofolio);
//router.get('/explore',function(req,res){
  //res.render('explore');
//});
router.get('/explore/:id',PController.findanyportofolio);
router.get('/home',PController.getuser);
router.post('/put/link/' , PController.put_link);
router.post('/put/screenshot/',upload.single('img') , PController.put_screenshot);

module.exports = router;