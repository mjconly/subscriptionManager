const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database");



//connect to db
mongoose.connect(config.database);
let db = mongoose.connection;

//check connections
db.once("open", function(){
  console.log("Connected to database");
})


//check for db errors
db.on("error", function(err){
  console.log(err);
})


//init app
const app = express();

//bring in models
let Article = require("./models/article");


//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//middleware for body parser - for url encoded
app.use(bodyParser.urlencoded({extended: false}))
//middleware for body parser - application/json
app.use(bodyParser.json())

//load static files
app.use(express.static(path.join(__dirname, 'public')));

//express Session middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next){
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Bring in passport config
require("./config/passport")(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//global user variable
app.get("*", function(req, res, next){
  res.locals.user = req.user || null;
  //calls next piece of middle ware
  next();
})



//home route
app.get("/", function(req, res){
  Article.find({}, function(err, response){
    if (err){
      console.log(err);
    }
    else{
      res.render("index", {
        title:"Article",
        articles: response
      });
    }
  })
});

//route files
let routeArticles = require("./routes/articles");
let routeUsers = require("./routes/users");
app.use("/articles", routeArticles);
app.use("/users", routeUsers);

//start server
app.listen(3000, function(){
  console.log("Server listening on 3000...")
});
