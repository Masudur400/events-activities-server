import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";



const router = Router()

router.post('/register',
    userControllers.createUser)

router.post('/create-host',
    checkAuth(Role.SUPER_ADMIN),
    multerUpload.single('file'),
    userControllers.createHost)

router.get('/all-users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getAllUser)

router.get("/me",
    checkAuth(...Object.values(Role)),
    userControllers.getMe)

router.patch("/update-profile",
    checkAuth(...Object.values(Role)),
    multerUpload.single('file'),
    userControllers.updateMyProfile)


router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    userControllers.updateUserByAdmin)

router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getSingleUser)



export const UserRoutes = router