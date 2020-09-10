var express = require('express');
var router = express.Router();

var HomeController=require("../contronllers/HomeController");
var homeController= new HomeController();
var Login= require("../contronllers/LoginController");
var login=new Login;

/* GET home page. */
router.get('/', homeController.getindex);

// router.get("/login",login.getLogin);
// router.post("/login",login.postLogin);

router.get("/register",login.getRegister);
router.post("/register",login.postRegister);

// router.get("/products",function(req,res,next){
//   res.render("products",{title: "Kiot"})
// })

module.exports = router;
