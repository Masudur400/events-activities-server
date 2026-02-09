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
    // checkAuth(...Object.values(Role)),
    eventControllers.getAllEvents);

router.get("/my-events",
    checkAuth(Role.HOST),
    eventControllers.getMyEvents);

router.get(
    "/deleted-events",
    checkAuth(Role.SUPER_ADMIN),
    eventControllers.getDeletedEvents
);


router.get(
    "/my-deleted-events",
    checkAuth(Role.HOST),
    eventControllers.getMyDeletedEvents
);

router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    multerUpload.single('file'),
    eventControllers.updateEvent);

router.patch(
    "/soft-delete/:id",  
    checkAuth(Role.SUPER_ADMIN),
    eventControllers.softDeleteEventByAdmin
);

router.patch(
    "/restore/:id",  
    checkAuth(Role.SUPER_ADMIN),
    eventControllers.restoreEventByAdmin
);

router.patch(
    "/my-event/soft-delete/:id",
    checkAuth(Role.HOST),
    eventControllers.softDeleteMyEvent
);

router.patch(
    "/my-event/restore/:id",
    checkAuth(Role.HOST),
    eventControllers.restoreMyEvent
);

router.patch("/my-event/:id",
    checkAuth(Role.HOST, Role.SUPER_ADMIN),
    multerUpload.single('file'),
    eventControllers.updateMyEvent
);

router.get("/:id",
    // checkAuth(...Object.values(Role)),
    eventControllers.getSingleEvent);

router.delete("/:id",
    checkAuth(Role.SUPER_ADMIN),
    eventControllers.deleteEvent);

router.delete("/my-event/:id",
    checkAuth(Role.HOST),
    eventControllers.deleteMyEvent);



export const EventRoutes = router