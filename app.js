var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    flash           =require("connect-flash");
var Campground      = require("./models/campground");
var Comment         = require("./models/comment");
var User            = require("./models/user");
var seedDB          = require("./seeds");
var methodOverride  = require("method-override");

var commentRoutes        = require("./routes/comments"),
    campgroundRoutes     = require("./routes/campgrounds"),
    indexRoutes           = require("./routes/index");

//seedDB(); 

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
//mongoose.connect("mongodb+srv://shehzan:shehzan@teddy12-7kpaz.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG---------------------------------------------------------------
app.use(require("express-session")({
    secret: "This is just an encryption code!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Require Routes
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Camp Srever has started!");
});