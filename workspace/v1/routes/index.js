var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate email
                req.flash("error", "That email has already been registered.");
                return res.redirect("/register");
              } 

            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Camp Surfers " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



module.exports = router;