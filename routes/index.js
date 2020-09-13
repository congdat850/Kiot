var express = require('express');
var router = express.Router();

var HomeController=require("../contronllers/HomeController");
var homeController= new HomeController();
var ProductController= require("../contronllers/ProductController");
var productController= new ProductController();
var UserController=require("../contronllers/UserController");
var userController= new UserController();
var DealController= require("../contronllers/DealController");
var dealController= new DealController();

/* GET home page. */
router.get('/', homeController.getindex);
router.get("/products",productController.getListProduct);
router.get("/addProduct",productController.getAddProduct);
router.post("/addproduct",productController.postAddProduct)
// GET user page
router.get("/user",userController.getUser);
router.get("/addUser",userController.getAddUser);
router.post("/addUser",userController.postAddUser);
//Get deal page 
router.get("/addDeal",dealController.getAddDeal);
router.post("/addDealProduct",dealController.postAddDealProduct);
module.exports = router;
