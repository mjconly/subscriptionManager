const express = require("express")
const router = express.Router();


//bring in Article model
let Article = require("../models/article");
//bring in user model
let User = require("../models/user");

//add article route
router.get("/add_article", ensureAuthenticated, function(req, res){
  let userId = req.user._id;
  res.render("add_article", {
    userId:userId
  })
})

//get article route
router.get("/:id", ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, response){
    if (err){
      console.log(err);
      return;
    }
    else{
      res.render("article", {
        article:response
      });
    }
  });
});


//add submit POST route
router.post("/add_article", function(req, res){
  req.checkBody("stream", "streamer required").notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if (errors){
    res.render("add_article", {
      title:"Add Article",
      errors:errors
    });
  }
  else {
    let article = new Article();
    article.userid = req.body.userid;
    article.stream = req.body.stream;

    //check for duplicates, flash if dupe, save if not
    Article.findOne({"userid": req.body.userid, "stream": req.body.stream}, function(err, result){
      if (err){
        console.log(err);
        return;
      }
      else {
        console.log(result);
        if (result === null){
          console.log(result);
          article.save(function(err){
            if(err){
              console.log(err);
              return;
            }
            else{
              req.flash("success", "Streamer Added!");
              res.redirect("/users/userhome");
            }
          })
        }
        else {
          req.flash("warning", "Already Subscribed");
          res.redirect("/users/userhome");
        }
      }
    })
  }
})



//delete request for article
router.delete("/:id", function(req, res){
  let query = {_id:req.params.id}
  let del = {}
  del.stream = req.params.id
  Article.deleteOne(del, function(err){
    if (err){
      console.log(err);
    }
    req.flash("danger", "Article Deleted")
    res.send("Success");
  });
});


//Access Control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else {
    req.flash("danger", "Login Required");
    res.redirect("/users/login");
  }
}

module.exports = router
