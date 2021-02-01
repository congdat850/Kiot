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
router.get("/",homeController.GetHome);
//GET User
router.get("/user",userController.GetListUser);
router.get("/addUser",userController.GetAddUser);
router.post("/addUser", userController.PostAddUser)
//GET Customer
router.get("/customer",customer.GetListCustomer);
router.get("/addCustomer",customer.getAddCustomer);
router.post("/addCustomer",customer.postAddCustomer);
router.delete("/deleteCustomer/:id",customer.postDeleteCustomer);
router.post("/updateCustomer",customer.postUpdateCustomer)
//GET plank 
router.get("/warehousePlank",plankController.GetListWarehousePlank);
router.get("/addPlank",plankController.CreatePlank);
router.post("/addPlank",plankController.postAddPlank);
router.get("/listImportPlanks",plankController.getListImportPlanks);
router.get("/listExportPlanks",plankController.getListExportPlanks);
//Get order
router.get("/orderManagement", orderManagementController.GetListOrderManagement);
router.post("/postProcess",orderManagementController.PostProcess);
router.get("/createOrderManagement",orderManagementController.GetCreateOrderManagement);
router.post("/postCreateOrderManagement",orderManagementController.PostCreateOrderManagement);
router.post("/postSearchOrder",orderManagementController.PostSearchOrder);
router.post("/postFilterOder", orderManagementController.PostFilterOder);
// GET CoveredSurface
router.get("/coveredSurface",coveredSurfaceController.getListWarehouseCoverSurface);
router.get("/addCoveredSurface",coveredSurfaceController.createCoveredSurface);
router.post("/addCoveredSurface",coveredSurfaceController.postAddPCoveredSurface);
router.get("/listImportCoverSurface",coveredSurfaceController.getListImportCoverSurface);
module.exports = router;
