import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createEventZodSchema } from "./event.validation";
import { eventControllers } from "./event.controller";
import { Role } from "../user/user.interface";



const router = Router()

router.post('/create-event',
    checkAuth(Role.HOST),
    multerUpload.single('file'),
    validateRequest(createEventZodSchema),//(optional --> just for form data validation)
    eventControllers.createEvent)

router.get("/types",
    eventControllers.getEventTypes);

router.get("/all-events",
    checkAuth(...Object.values(Role)),
    eventControllers.getAllEvents);

router.get("/my-events",
    checkAuth(Role.HOST),
    eventControllers.getMyEvents);

router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    multerUpload.single('file'),
    eventControllers.updateEvent);

router.patch("/my-event/:id",
    checkAuth(Role.HOST),
    multerUpload.single('file'),
    eventControllers.updateMyEvent
);

router.get("/:id",
    checkAuth(...Object.values(Role)),
    eventControllers.getSingleEvent);

router.delete("/:id",
    checkAuth(Role.SUPER_ADMIN),
    eventControllers.deleteEvent);

router.delete("/my-event/:id",
    checkAuth(Role.HOST),
    eventControllers.deleteMyEvent);



export const EventRoutes = router