import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Pages/adminPages/AdminLogin";
import Home from "../Pages/adminPages/HomeAdmin";
import AdminProtected from "../Pages/adminPages/AdminProtected";
import ForgotPassAdmin from "../Pages/adminPages/ForgotPassAdmin";
import ForgotOtpAdmin from "../Pages/adminPages/ForgotOtpAdmin";
import ResetPassAdmin from "../Pages/adminPages/ResetPassAdmin";
import Students from "../Pages/adminPages/Students";
import Instructors from "../Pages/adminPages/Instructors";
import InstructorDetails from "../Pages/adminPages/InstructorDetails";
import StudentDetails from "../Pages/adminPages/StudentDetails";
import Permissions from "../Pages/adminPages/Permissions";
import Courses from "../Pages/adminPages/Courses";
import { ErrorProvider } from "../Pages/adminPages/AdminErrorBoundary";


const instructorRoutes = () => {
  return (
    <ErrorProvider>
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard"element={<AdminProtected> <Home /></AdminProtected> }/>
      <Route path="/students"element={ <AdminProtected><Students /></AdminProtected>  } />
      <Route path="/instructors" element={<AdminProtected> <Instructors /></AdminProtected>}/>
      <Route path="/students/studentDetails/:id" element={<AdminProtected> <StudentDetails /></AdminProtected>}/>
      <Route path="/instructors/instructorDetails/:id" element={<AdminProtected> <InstructorDetails /></AdminProtected>}/>
      <Route path="/permissions" element={<AdminProtected> <Permissions /></AdminProtected>}/>
      <Route path="/courses" element={<AdminProtected> <Courses /></AdminProtected>}/>
      <Route path="/forgotpassword" element={<ForgotPassAdmin />} />
      <Route path="/otp-forgotadmin" element={<ForgotOtpAdmin />} />
      <Route path="/resetPassword" element={<ResetPassAdmin />} />
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
      <Route path="" element />
    </Routes>
    </ErrorProvider>
  );
};

export default instructorRoutes;
