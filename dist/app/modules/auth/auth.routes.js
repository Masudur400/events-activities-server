"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const auth_controller_1 = require("./auth.controller");
const preventLoggedInUser_1 = require("../../utils/preventLoggedInUser");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authControllers.loginUser);
router.post('/logout', auth_controller_1.authControllers.logout);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authControllers.changePassword);
router.post("/forget-password", preventLoggedInUser_1.preventLoggedInUser, // condition without logedin user can send request
auth_controller_1.authControllers.forgetPassword);
exports.AuthRoutes = router;
