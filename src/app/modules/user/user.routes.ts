import { Router } from "express";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";



const router = Router()

router.post('/register',
    validateRequest(createUserZodSchema), //(optional --> just for form data validation)
    userControllers.createUser)

router.post('/create-host',
    checkAuth(Role.SUPER_ADMIN),
    multerUpload.single('file'),
    validateRequest(createUserZodSchema), //(optional --> just for form data validation)
    userControllers.createHost)

router.get('/all-users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getAllUser)

router.get(
    "/all-hosts",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getAllHosts);

router.get("/me",
    checkAuth(...Object.values(Role)),
    userControllers.getMe)

router.patch(
    "/update-profile",
    checkAuth(...Object.values(Role)),
    multerUpload.single('file'),
    validateRequest(updateUserZodSchema),  //(optional --> just for form data validation)
    userControllers.updateMyProfile
);


router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(updateUserZodSchema),
    userControllers.updateUserByAdmin)

router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    userControllers.getSingleUser)


router.delete(
    "/delete-host/:id",
    checkAuth(Role.SUPER_ADMIN),  
    userControllers.deleteHost
);



export const UserRoutes = router