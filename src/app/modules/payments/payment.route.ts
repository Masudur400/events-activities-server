import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";


const router = express.Router();


router.post("/init-payment/:bookingId",
    PaymentController.initPayment);

router.post("/success",
    PaymentController.successPayment);

router.post("/fail",
    PaymentController.failPayment);

router.post("/cancel",
    PaymentController.cancelPayment);

router.get("/invoice/:paymentId",
    checkAuth(...Object.values(Role)),
    PaymentController.getInvoiceDownloadUrl);

router.post("/validate-payment",
    PaymentController.validatePayment)

router.get("/my-payments",
    checkAuth(...Object.values(Role)),
    PaymentController.getMyPayments);

router.get("/all-payments",
    checkAuth(Role.SUPER_ADMIN),
    PaymentController.getAllPayments
);


export const PaymentRoutes = router;