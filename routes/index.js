var express = require('express');
var router = express.Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();
const CustomerController= require("../controllers/CustomerController");
const customer = new CustomerController();
const PlankController = require("../controllers/PlankController");
const plankController = new PlankController();
const OrderManagementController= require("../controllers/OrderManagementController");
const orderManagementController = new OrderManagementController();
const CoveredSurfaceController = require("../controllers/CoveredSurfaceController");
const coveredSurfaceController = new CoveredSurfaceController();
const HomeController = require("../controllers/HomeController");
const homeController = new HomeController();


//GET Home
router.get("/",homeController.getHome);
//GET User
router.get("/user",userController.getListUser);
router.get("/addUser",userController.getAddUser);
router.post("/addUser", userController.postAddUser)
//GET Customer
router.get("/customer",customer.getListCustomer);
router.get("/addCustomer",customer.getAddCustomer);
router.post("/addCustomer",customer.postAddCustomer);
router.delete("/deleteCustomer/:id",customer.postDeleteCustomer);
router.post("/updateCustomer",customer.postUpdateCustomer)
//GET plank 
router.get("/warehousePlank",plankController.getListWarehousePlank);
router.get("/addPlank",plankController.createPlank);
router.post("/addPlank",plankController.postAddPlank);
router.get("/listImportPlanks",plankController.getListImportPlanks);
router.get("/listExportPlanks",plankController.getListExportPlanks);
//Get order
router.get("/orderManagement", orderManagementController.getListOrderManagement);
router.post("/postProcess",orderManagementController.postProcess);
router.get("/createOrderManagement",orderManagementController.getCreateOrderManagement);
router.post("/postCreateOrderManagement",orderManagementController.postCreateOrderManagement);
router.post("/postSearchOrder",orderManagementController.postSearchOrder);
router.post("/postFilterOder", orderManagementController.postFilterOder);
// GET CoveredSurface
router.get("/coveredSurface",coveredSurfaceController.getListWarehouseCoverSurface);
router.get("/addCoveredSurface",coveredSurfaceController.createCoveredSurface);
router.post("/addCoveredSurface",coveredSurfaceController.postAddPCoveredSurface);
router.get("/listImportCoverSurface",coveredSurfaceController.getListImportCoverSurface);
module.exports = router;
