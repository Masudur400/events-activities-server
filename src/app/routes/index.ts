import { Router } from "express"; 
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { EventTypeRoutes } from "../modules/eventTypes/eventType.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    }, 
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/event-type',
        route: EventTypeRoutes
    },
]





moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})