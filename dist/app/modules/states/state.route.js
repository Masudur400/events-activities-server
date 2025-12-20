"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const state_controller_1 = require("./state.controller");
const router = express_1.default.Router();
// Admin State
router.get("/super-admin", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), state_controller_1.StateController.getAdminState);
// Host State
router.get("/host", (0, checkAuth_1.checkAuth)(user_interface_1.Role.HOST), state_controller_1.StateController.getHostState);
// User State
router.get("/user", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), state_controller_1.StateController.getUserState);
exports.StateRoutes = router;
