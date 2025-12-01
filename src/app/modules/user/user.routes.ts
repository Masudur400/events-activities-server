import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";



const router = Router()

router.post('/register', userControllers.createUser)
router.post('/create-host', checkAuth(Role.SUPER_ADMIN), userControllers.createHost)
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUser)
router.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getSingleUser)
// router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)


export const UserRoutes = router