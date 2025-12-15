import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { authControllers } from "./auth.controller";
import { preventLoggedInUser } from "../../utils/preventLoggedInUser";



const router = Router()

router.post('/login', authControllers.loginUser)
router.post('/logout', authControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), authControllers.changePassword)
router.post(
  "/forget-password",
  preventLoggedInUser, // condition without logedin user can send request
  authControllers.forgetPassword
);


export const AuthRoutes = router;