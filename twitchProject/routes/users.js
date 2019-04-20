const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");


//bring in user model
let User = require("../models/user");
//bring in Article model
let Article = require("../models/article");



//register form
router.get("/register", function(req, res){
  res.render("register");
});

//register process
router.post("/register", function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody("name", "Name required").notEmpty();
  req.checkBody("email", "Email required").notEmpty();
  req.checkBody("email", "Not a valid email").isEmail();
  req.checkBody("username", "Username required").notEmpty();
  req.checkBody("password", "Password required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(req.body.password);

  let errors = req.validationErrors();

  if (errors){
    res.render("register", {
      errors:errors
    })
  }
  else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    //generate SALT
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          else{
            req.flash("success", "Registration complete! Please login");
            res.redirect("/users/login")
          }
        })
      });
    })
  }
});



//get login form request
router.get("/login", function(req, res){
  res.render("login");
})

// get userhome
router.get("/userhome", ensureAuthenticatedUse, function(req, res){
  let userId = req.user._id
  let username = req.user.username
  Article.find({}, function(err, response){
    if (err){
      console.log(err);
    }
    else{
      res.render("userhome", {
        articles:response,
        userId:userId,
        username:username,
        userobj: req.user
      })
    }
  })
})

//login post
router.post("/login", function(req, res, next){
  passport.authenticate("local", {
    successRedirect:"/users/userhome",
    failureRedirect:"/users/login",
    failureFlash: true
  })(req, res, next);
})

//logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/users/login");
})


//Access Control
function ensureAuthenticatedUse(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else {
    req.flash("danger", "Login Required");
    res.redirect("/users/login");
  }
}

module.exports = router;
