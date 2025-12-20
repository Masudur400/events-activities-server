"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = require("../../middlewares/validateRequest");
const event_validation_1 = require("./event.validation");
const event_controller_1 = require("./event.controller");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/create-event', (0, checkAuth_1.checkAuth)(user_interface_1.Role.HOST), multer_config_1.multerUpload.single('file'), (0, validateRequest_1.validateRequest)(event_validation_1.createEventZodSchema), //(optional --> just for form data validation)
event_controller_1.eventControllers.createEvent);
router.get("/types", event_controller_1.eventControllers.getEventTypes);
router.get("/all-events", 
// checkAuth(...Object.values(Role)),
event_controller_1.eventControllers.getAllEvents);
router.get("/my-events", (0, checkAuth_1.checkAuth)(user_interface_1.Role.HOST), event_controller_1.eventControllers.getMyEvents);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single('file'), event_controller_1.eventControllers.updateEvent);
router.patch("/my-event/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.HOST, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single('file'), event_controller_1.eventControllers.updateMyEvent);
router.get("/:id", 
// checkAuth(...Object.values(Role)),
event_controller_1.eventControllers.getSingleEvent);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN), event_controller_1.eventControllers.deleteEvent);
router.delete("/my-event/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.HOST), event_controller_1.eventControllers.deleteMyEvent);
exports.EventRoutes = router;
