import api from "./axiosConfig";
import { User } from "../../utils/types";
import { Instructor } from "../../utils/types";
import { Course } from "../../utils/types";
import { AxiosResponse } from "axios";
import { ObjectId, Schema } from "mongoose";

const registerUser = async (userData: {
  name: string;
  email: string;
  contact?: string;
  password?: string;
  profileImage?: string;
  googleUserId?: string;
}) => {
  return await api.post("/register", userData);
};
const loginUser = async (userData: {
  email: string;
  password?: string;
  googleUserId?: string;
}) => {
  return await api.post("/login", userData);
};
const addCart = async (id: { id: ObjectId }) => {
  return await api.post("/addCart", id);
};
const addSaved = async (id: { id: ObjectId }) => {
  return await api.post("/addsaved", id);
};
const fetchMyitems = async () => {
  return await api.post("/fetchcart");
};
const createCheckout = async (data: { data: any }) => {
  console.log(data);
  return await api.post("/createCheckout", data);
};
const PurchaseSuccess = async (data: { Total: any }) => {
  return await api.post("/purchasesuccess", data);
};
const unCart = async (data: { id: ObjectId }) => {
  return await api.post("/uncart", data);
};
const removeSavedCourse = async (data: { id: ObjectId }) => {
  return await api.post("/removesaved", data);
};
const fetchMycourses = async () => {
  return await api.post("/fetchMycourses");
};
const sendOtp = async (email: { email: string }) => {
  return await api.post("/send-otp", email);
};
const updateSectionProgress = async (data: {courseId: ObjectId |any;sectionId: string|null;progress: number;}) => {
  return await api.post("/updateSectionProgress", data);
};

const ForgotOtpStudent = async (email: { email: string }) => {
  return await api.post("/forgot-otp", email);
};
const updateEmailUser = async (email: { email: string }) => {
  return await api.post("/updateemailuser", email);
};

const updateEmail = async (email: { email: string }) => {
  return await api.post("/updateEmail-otp", email);
};
const EmailInstUpdate = async (email: { email: string }) => {
  return await api.post("/instructor/updateemailuser", email);
};

const updateEmailinst = async (email: { email: string }) => {
  return await api.post("/instructor/updateEmail-otp", email);
};

const changePassword = async (data: {
  currentPass: string;
  newPass: string;
}) => {
  return await api.post("/changePassword", data);
};

const CheckUser = async (data: { id: string }) => {
  return await api.post("/checkuser", data);
};

const PasswordUpdate = async (data: {
  email: string | any;
  newpass: string;
}) => {
  return await api.post("/updatePassword", data);
};

const UploadImageStudent = async (data: { profileImage: string }) => {
  return await api.post("/uploadimagestudent", data);
};

const updateUser = async (userData: {
  id: string;
  name: string;
  email: string;
  contact: string;
}) => {
  return await api.post("/update", userData);
};

const userRefreshToken = async () => {
  return await api.post("/refreshToken");
};
const instRefreshToken = async () => {
  return await api.post("/instructor/refreshToken");
};
const AdminRefreshToken = async () => {
  return await api.post("/admin/refreshToken");
};

const userFetchCourse = async () => {
  return await api.post("/courses");
};

const fetchMyInstructors=async()=>{
  return await api.post("/fetchMyInstructor");
}
const deleteUserChat=async(data:{ChatId:string})=>{
  return await api.post("/deleteUserChat",data)
}
const deleteInsturctorChat=async(data:{ChatId:string})=>{
  console.log(data,"[[");
  return await api.post("/instructor/deleteInstructorChat",data)
}

const DeleteReview=async(data:{reviewId:string})=>{
return await api.post("/deleteReview",data)
}

const FetchAllReviews=async()=>{
  return await api.post("/FetchAllReviews");
}
const FetchAllReviewsInst=async()=>{
  return await api.post("/instructor/FetchAllReviews");
}

const submitcourseReviews=async(data:{ courseId: any; comment: string;rating: number;})=>{
  return await api.post("/submitcourseReview",data);
}

const fetchMyStudents=async()=>{
  return await api.post("/instructor/fetchMyStudents");
}
const fetchMyEnroll=async()=>{
  return await api.post("/instructor/fetchMyEnroll");
}
const fetchMessages=async(data:{receiverId:Schema.Types.ObjectId|any})=>{
  console.log(data,"datain");
  return await api.post("/instructor/fetchMessages",data);
}
const reviewReply=async( data: { reviewId: string; reply: string; })=>{
  console.log(data,"datainreview");
  return await api.post("/instructor/reviewReply",data);
}
const fetchUserMessages=async(data:{receiverId:Schema.Types.ObjectId|any})=>{
  console.log(data,"datain user");
  return await api.post("/fetchUserMessages",data);
}

// changePassword
const FetchCourses = async (): Promise<AxiosResponse<Course[]>> => {
  return await api.post<Course[]>("/instructor/mycourses");
};
const fetchAllcourses = async (): Promise<AxiosResponse<Course[] | any>> => {
  return await api.post<Course[]>("/admin/courses");
};

const Addcourse = async (data: {
  courseTitle: string;
  description: string;
  courseDuration: number;
  coursePrice: number;
  categories: string;
  courseLevel: string;
  image: string;
  sections: { title: string; description: string; videoURL: string }[];
}) => {
  return await api.post("/instructor/addcourse", data);
};
const UpdateCourse = async (data: {
  id: any;
  title: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  level: string;
  thumbnail: string;
  sections: { title: string; description: string; videoURL: string }[];
}) => {
  return await api.post("/instructor/updateCourse", data);
};

const CheckInstructor = async (data: { id: string }) => {
  return await api.post("/instructor/checkinstructor", data);
};

const UploadImageInstructor = async (data: { profileImage: string }) => {
  return await api.post("/instructor/uploadimageinstructor", data);
};
const updateInstructor = async (userData: {
  name: string;
  email: string;
  contact: string;
  description: string;
}) => {
  return await api.post("/instructor/update", userData);
};
const InstchangePassword = async (data: {
  currentPass: string;
  newPass: string;
}) => {
  return await api.post("/instructor/changePassword", data);
};

const instructorRegister = async (userData: {
  name: string;
  email: string;
  description?: string;
  contact?: string;
  password?: string;
  profileImage?: string;
  googleUserId?: string;
}) => {
  console.log("instructorRegister");
  return await api.post("/instructor/register", userData);
};

const PasswordUpdateInst = async (data: {
  email: string | any;
  newpass: string;
}) => {
  return await api.post("/instructor/updatePassword", data);
};
const PasswordUpdateAdmin = async (data: {
  email: string | any;
  newpass: string;
}) => {
  return await api.post("/admin/updatePassword", data);
};

const instructorLogin = async (userData: {
  email: string;
  password?: string;
  googleUserId?: string;
}) => {
  return await api.post("/instructor/login", userData);
};
const sendOtpInst = async (email: { email: string }) => {
  return await api.post("/instructor/send-otp", email);
};

const ForgotOtpinstructor = async (email: { email: string }) => {
  return await api.post("/instructor/forgot-otp", email);
};

const adminLogin = async (userData: { email: string; password: string }) => {
  return await api.post("/admin/login", userData);
};
const FetchStudents = async (): Promise<AxiosResponse<User[]>> => {
  return await api.post<User[]>("/admin/students");
};

const FetchInstructors = async (): Promise<AxiosResponse<Instructor[]>> => {
  return await api.post<Instructor[]>("/admin/instructors");
};

const ForgotOtpAdminFunction = async (email: { email: string }) => {
  return await api.post("/admin/forgot-otp", email);
};

const ChangeBlock = async (data: { id: string; status: boolean }) => {
  return await api.post("/admin/statusChange", data);
};

const ChangeBlockInstructor = async (data: { id: string; status: boolean }) => {
  return await api.post("/admin/changeInstructorStatus", data);
};

const approveCourse = async (data: { id: ObjectId }) => {
  return await api.post("/admin/approveCourse", data);
};

const rejectCourse = async (data: { id: ObjectId }) => {
  return await api.post("/admin/rejectCourse", data);
};

const fetchInstructor = async (data: { id: ObjectId }) => {
  return await api.post("/admin/fetchInstructor", data);
};




export {
  registerUser,
  CheckUser,
  loginUser,
  instructorRegister,
  CheckInstructor,
  instructorLogin,
  adminLogin,
  sendOtp,
  sendOtpInst,
  Addcourse,
  ForgotOtpStudent,
  PasswordUpdate,
  ForgotOtpinstructor,
  PasswordUpdateInst,
  ForgotOtpAdminFunction,
  PasswordUpdateAdmin,
  updateUser,
  changePassword,
  updateInstructor,
  InstchangePassword,
  FetchStudents,
  ChangeBlock,
  FetchInstructors,
  ChangeBlockInstructor,
  UploadImageStudent,
  UploadImageInstructor,
  FetchCourses,
  fetchAllcourses,
  approveCourse,
  rejectCourse,
  fetchInstructor,
  userFetchCourse,
  addCart,
  fetchMyitems,
  unCart,
  createCheckout,
  userRefreshToken,
  instRefreshToken,
  AdminRefreshToken,
  PurchaseSuccess,
  fetchMycourses,
  addSaved,
  removeSavedCourse,
  updateEmail,
  updateEmailUser,
  updateEmailinst,
  EmailInstUpdate,
  UpdateCourse,
  updateSectionProgress,
  fetchMyInstructors,
  fetchMyStudents,
   fetchMessages,
   fetchUserMessages,
   fetchMyEnroll,
   submitcourseReviews,
   FetchAllReviews,
   reviewReply,
   FetchAllReviewsInst,
   DeleteReview,
   deleteInsturctorChat,
   deleteUserChat
};
