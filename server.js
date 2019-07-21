// requiring express
var express = require("express");
// requiring mongoose
var mongoose = require("mongoose");

// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// is working on localhost3000
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database//
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);