import express from "express";
const router = express.Router();
import { studentController } from "../Controllers/studentController";
import { studentInteractor } from "../Interactors/studentInteratcor";
import { studentRepository } from "../Repostitory/studentRepository";
import { studentAuth } from "../middlewares/studentAuth";


const repository = new studentRepository();
const interactor = new studentInteractor(repository);
const controller = new studentController(interactor);

router.post("/register", controller.onCreateUser.bind(controller));
router.post("/login", controller.onLoginUser.bind(controller));
router.post("/send-otp", controller.onSendOtp.bind(controller));
router.post("/forgot-otp", controller.onForgotOtp.bind(controller));
router.post("/updateEmail-otp", controller.onSendOtp.bind(controller));
router.post("/updatePassword", controller.onUpdatePassword.bind(controller));
router.post("/update",studentAuth, controller.onUpdate.bind(controller));
router.post("/changePassword",studentAuth, controller.onChangePassword.bind(controller));
router.post("/uploadimagestudent",studentAuth,controller.onUploadImageStudent.bind(controller));
router.post("/checkuser", controller.onCheckUser.bind(controller));
router.post("/courses",controller.onFetchCourse.bind(controller));
router.post("/addCart",studentAuth,controller.onAddCart.bind(controller));
router.post("/addsaved",studentAuth,controller.onAddSaved.bind(controller));
router.post("/fetchcart",studentAuth,controller.onFetchCart.bind(controller));
router.post("/uncart",studentAuth,controller.onUnCart.bind(controller));
router.post("/removesaved",studentAuth,controller.onRemovedSaved.bind(controller));
router.post('/createCheckout',studentAuth,controller.onCheckout.bind(controller))
router.post('/purchasesuccess',studentAuth,controller.onSuccess.bind(controller))
router.post('/fetchMycourses',studentAuth,controller.onFetchMyCourses.bind(controller))
router.post('/updateemailuser',studentAuth,controller.onUpdateEmail.bind(controller))
router.post('/fetchMyInstructor',studentAuth,controller.onFetchMyInstructor.bind(controller))
router.post('/updateSectionProgress',studentAuth,controller.onSectionProgress.bind(controller))
router.post('/fetchUserMessages',studentAuth,controller.onfetchMessages.bind(controller))
router.post('/FetchAllReviews',studentAuth,controller.onFetchAllReviews.bind(controller))
router.post('/submitcourseReview',studentAuth,controller.onSubmitcourseReview.bind(controller))
router.post('/deleteReview',studentAuth,controller.onDeleteReview.bind(controller))
router.post('/deleteUserChat',studentAuth,controller.onDeleteUserChat.bind(controller))
router.post('/refreshToken',controller.onRefreshToken.bind(controller))
export default router;
