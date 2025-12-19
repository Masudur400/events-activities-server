import { Router } from "express"; 
import { contactControllers } from "./contact.controller";

const router = Router(); 
 
router.post("/send", contactControllers.sendContactMail);

export const ContactRoutes = router;