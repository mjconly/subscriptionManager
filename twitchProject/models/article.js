//bring in mongoose
let mongoose = require("mongoose");

//create schema
let articleSchema = mongoose.Schema({
  userid:{
    type:String,
    required: true
  },
  stream:{
    type: String,
    required: true
  },
});


//pass in name of model
let Article = module.exports = mongoose.model("article", articleSchema);
