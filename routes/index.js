var express = require('express');
var router = express.Router();

const UserController = require("../contronllers/UserController");
const userController = new UserController();
const CustomerController= require("../contronllers/CustomerController");
const customer = new CustomerController();
const PlankController = require("../contronllers/PlankController");
const plankController = new PlankController();
const OrderManagementController= require("../contronllers/OrderManagementController");
const orderManagementController = new OrderManagementController();
const CoveredSurfaceController = require("../contronllers/CoveredSurfaceController");
const coveredSurfaceController = new CoveredSurfaceController();

// GET User
router.get("/user",userController.GetListUser);
router.get("/addUser",userController.GetAddUser);
router.post("/addUser", userController.PostAddUser)
//GET Customer
router.get("/customer",customer.GetListCustomer);
//GET plank 
router.get("/warehousePlank",plankController.GetListWarehousePlank);
//Get order
router.get("/orderManagement", orderManagementController.GetListOrderManagement);
router.post("/postProcess",orderManagementController.PostProcess);
router.get("/createOrderManagement",orderManagementController.GetCreateOrderManagement);
router.post("/postCreateOrderManagement",orderManagementController.PostCreateOrderManagement);
router.post("/postSearchOrder",orderManagementController.PostSearchOrder);
router.post("/postFilterOder", orderManagementController.PostFilterOder);
// router.get("/GetDataAutocomplete",orderManagementController.GetDataAutocomplete);
// GET CoveredSurface
router.get("/coveredSurface",coveredSurfaceController.GetListWarehouseCoverSurface);
module.exports = router;
