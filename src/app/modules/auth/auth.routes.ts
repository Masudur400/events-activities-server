import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { authControllers } from "./auth.controller";



const router = Router()

router.post('/login', authControllers.loginUser)
router.post('/logout', authControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), authControllers.changePassword)


export const AuthRoutes = router;