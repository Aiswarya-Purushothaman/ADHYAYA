import express from "express";
const router = express.Router();
import { admincontroller } from "../Controllers/adminController";
import { adminInteractor } from "../Interactors/adminInteractor";
import { adminRepository } from "../Repostitory/adminRepository";
import { AdminAuth } from "../middlewares/adminAuth";
const repository = new adminRepository();
const interactor = new adminInteractor(repository);
const controller = new admincontroller(interactor);

router.post("/login",controller.onLoginAdmin.bind(controller));
router.post("/forgot-otp", controller.onforgotAdminotp.bind(controller));
router.post("/students", controller.onFetchStudents.bind(controller));
router.post("/instructors", controller.onFetchInstructors.bind(controller));
router.post("/updatePassword", controller.onUpdatePassword.bind(controller));
router.post("/statusChange", controller.onChangeStatus.bind(controller));
router.post("/changeInstructorStatus", controller.onChangeStatusInstructor.bind(controller));
router.post("/courses", controller.onfetchAllcourses.bind(controller));
router.post("/approveCourse", controller.onApproveCourses.bind(controller));
router.post("/rejectCourse", controller.onRejectCourse.bind(controller));
router.post("/fetchInstructor", controller.onFetchInstructor.bind(controller));
router.post('/refreshToken',controller.onRefreshToken.bind(controller))


export default router;
