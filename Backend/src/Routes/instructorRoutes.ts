import express from "express";
const router = express.Router();
import { instructorController } from "../Controllers/instructorController";
import { instructorRepository } from "../Repostitory/instructorRepository";
import { instructorInteractor } from "../Interactors/instructorInteractor";
import { instructorAuth } from "../middlewares/instructorAuth";

// console.log("instructor routes hain");

const repository = new instructorRepository();
const interactor = new instructorInteractor(repository);
const controller = new instructorController(interactor);

router.post("/send-otp", controller.onSendotp.bind(controller));
router.post("/register", controller.onCreateInstructor.bind(controller));
router.post("/login", controller.onLoginInstructor.bind(controller));
router.post("/forgot-otp", controller.onForgotOtpInst.bind(controller));
router.post("/updatePassword", controller.onUpdatePassword.bind(controller));
router.post("/update",instructorAuth, controller.onUpdate.bind(controller));
router.post("/changePassword",instructorAuth,  controller.onChangePassword.bind(controller));
router.post("/uploadimageinstructor",instructorAuth, controller.onUploadImageInst.bind(controller));
router.post ("/checkinstructor",controller.OnChekcInstructor.bind(controller))
router.post('/addcourse',instructorAuth,controller.onAddCourse.bind(controller))
router.post('/mycourses',instructorAuth,controller.onMyCourse.bind(controller))
router.post('/updateEmail-otp',instructorAuth,controller.onSendotp.bind(controller))
router.post('/updateemailuser',instructorAuth,controller.onUpdateEmail.bind(controller))
router.post('/updateCourse',instructorAuth,controller.onUpdateCourse.bind(controller))
router.post('/fetchMyStudents',instructorAuth,controller.onFetchMyStudents.bind(controller))
router.post('/fetchMyEnroll',instructorAuth,controller.onFetchMyEnroll.bind(controller))
router.post('/fetchMessages',instructorAuth,controller.onfetchMessages.bind(controller))
router.post('/reviewReply',instructorAuth,controller.onReviewReply.bind(controller))
router.post('/FetchAllReviews',instructorAuth,controller.onFetchAllReviews.bind(controller))
router.post('/deleteInstructorChat',instructorAuth,controller.onDeleteInstructorChat.bind(controller))
router.post('/refreshToken',controller.onRefreshToken.bind(controller))
export default router;
