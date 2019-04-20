const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

//export local Strategy
module.exports = function(passport){
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};
    User.findOne(query, function(err, user){
      if (err){
        throw err
      }
      //if no user in db
      if (!user){
        return done(null, false, {message: "User not found"});
      }
      //otherwise match the password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if (err) throw err;

        //check is Match value
        if (isMatch){
          return done(null, user);
        }
        else{
          return done(null, false, {message: "Incorrect password"})
        }
      });
    });
  }));

  
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    })
  })


}
