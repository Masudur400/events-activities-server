import { Router } from "express";  
import { eventTypeControllers } from "./eventType.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";



const router = Router()

router.post('/create-event-type',
    checkAuth(Role.SUPER_ADMIN),
    eventTypeControllers.createEventType)

router.get('/all-event-types',
    checkAuth(Role.SUPER_ADMIN),
    eventTypeControllers.getAllEventTypes)
    
router.delete('/:id',
    checkAuth(Role.SUPER_ADMIN),
    eventTypeControllers.deleteEventType)



export const EventTypeRoutes = router