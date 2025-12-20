"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), //(optional --> just for form data validation)
user_controller_1.userControllers.createUser);
router.post('/create-host', (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single('file'), (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), //(optional --> just for form data validation)
user_controller_1.userControllers.createHost);
router.get('/all-users', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getAllUser);
router.get("/all-hosts", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getAllHosts);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.getMe);
router.patch("/update-profile", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), multer_config_1.multerUpload.single('file'), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), //(optional --> just for form data validation)
user_controller_1.userControllers.updateMyProfile);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.userControllers.updateUserByAdmin);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.getSingleUser);
router.delete("/delete-host/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), user_controller_1.userControllers.deleteHost);
exports.UserRoutes = router;
