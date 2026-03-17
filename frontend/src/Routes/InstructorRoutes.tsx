import { Route, Routes } from "react-router-dom";
import InstructorRegister from "../Pages/instructorPages/InstructorRegister";
import InstructorLogin from "../Pages/instructorPages/InstructorLogin";
import InstOtp from "../Pages/instructorPages/InstOtp";
import Home from "../Pages/instructorPages/InstHome";
import Instprotected from "../Pages/instructorPages/Instprotected";
import InstForgotPassword from "../Pages/instructorPages/instForgotPassword";
import ForgotOtpInst from "../Pages/instructorPages/ForgotOtpInst";
import ResetPassInst from "../Pages/instructorPages/ResetPassInst";
import InstProfile from "../Pages/instructorPages/InstProfile"
import InstChangePassword from '../Pages/instructorPages/InstChangePassword'
import InstUpdate from '../Pages/instructorPages/InstUpdate'
import AddCourse from "../Pages/instructorPages/AddCourse";
import AddCourse2 from "../Pages/instructorPages/AddCourse2";
import Courses from "../Pages/instructorPages/Courses";
import { ErrorProvider } from "../Pages/instructorPages/InstErrorBoundary";
import UpdateEmailnst from "../Pages/instructorPages/UpdateEmailInst";
import EmailUpdateOtp from "../Pages/instructorPages/EmailUpdateOtp";
import EditCourse from "../Pages/instructorPages/EditCourse";
import ChatInstructor from "../Pages/instructorPages/ChatInstructor";
import MyStudents from "../Pages/instructorPages/MyStudents";
import StudentDetails from "../Pages/instructorPages/StudentDetails";


const instructorRoutes = () => {
  return (
    <ErrorProvider>
    <Routes>
      <Route path="/register" element={<InstructorRegister />} />
      <Route path="/login" element={<InstructorLogin />} />
      <Route path="/inst-otp" element={<InstOtp /> } />
      <Route path="/dashboard" element={ <Instprotected> <Home /> </Instprotected> } />
      <Route path="/instForgotPassword" element={<InstForgotPassword />} />
      <Route path="/otp-forgotinst" element={<ForgotOtpInst />} />
      <Route path="/resetPassword" element={<ResetPassInst />} />
      <Route path="/profile" element={<InstProfile /> } />
      <Route path="/updateProfile" element={ <Instprotected><InstUpdate /></Instprotected>} />
      <Route path="/changepassword" element={ <Instprotected><InstChangePassword /></Instprotected>} />
      <Route path="/addcourse" element={ <Instprotected><AddCourse /></Instprotected>} />
      <Route path="/addcourse2" element={ <Instprotected><AddCourse2 /></Instprotected>} />
      <Route path="/courses" element={ <Instprotected><Courses /></Instprotected>} />
      <Route path="/updateEmail" element={ <Instprotected><UpdateEmailnst /></Instprotected>} />
      <Route path="/chat" element={ <Instprotected><ChatInstructor /></Instprotected>} />
      <Route path="/students" element={ <Instprotected><MyStudents /></Instprotected>} />
      <Route path="/students/studentDetails/:id" element={<Instprotected> <StudentDetails /></Instprotected>}/>
      <Route path="/otp-emailupdateInst" element={<Instprotected> <EmailUpdateOtp /></Instprotected>} />
      <Route path="/editCourse/:id" element={ <Instprotected><EditCourse/></Instprotected>} />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
    </Routes>
    </ErrorProvider>
  );
};

export default instructorRoutes;
