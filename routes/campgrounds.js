var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req, res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});        
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc= req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    //create and save to DB:
    Campground.create(newCampground,function(err,newCamp){
        if(err){
            req.flash("error","Something went Wrong!.");
            console.log(err);
        }else{
            //redirect back to campgrounds page
            req.flash("success","Campground Created Successfully.");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err || !foundCamp){
            res.flash("error", "Campground not Found")
            res.redirect("back")
        }else{
               res.render("campgrounds/show",{campground: foundCamp}); 
        }
    });
});

//EDIT:
router.get("/:id/edit", middleware.checkOwnership, function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

router.put("/:id",middleware.checkOwnership, function(req,res){
    //update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    }); 
    //redirect
});


//Delete:

router.delete("/:id", middleware.checkOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;