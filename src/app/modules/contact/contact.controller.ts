import { Request, Response } from "express"; 
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { contactServices } from "./contact.service";

const sendContactMail = catchAsync(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "All fields are required",
      data: null,
    });
  }

  await contactServices.sendContactMailService({ name, email, subject, message });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent successfully",
    data: null,
  });
});

export const contactControllers = {
  sendContactMail,
};