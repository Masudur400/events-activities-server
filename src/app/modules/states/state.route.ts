import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StateController } from "./state.controller";

const router = express.Router();

// Admin State
router.get(
  "/super-admin",
  checkAuth(Role.SUPER_ADMIN),
  StateController.getAdminState
);

// Host State
router.get(
  "/host",
  checkAuth(Role.HOST),
  StateController.getHostState
);

// User State
router.get(
  "/user",
  checkAuth(...Object.values(Role)),
  StateController.getUserState
);

export const StateRoutes = router;
