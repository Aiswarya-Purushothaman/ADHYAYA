import { Route, Routes } from "react-router-dom";
import Register from "../Pages/userPages/Register";
import Login from "../Pages/userPages/Login";
import Otp from "../Pages/userPages/Otp";
import Home from "../Pages/userPages/Home";
import ResetPassword from "../Pages/userPages/ResetPassword";
import ForgotPassword from "../Pages/userPages/ForgotPassword";
import ForgotOtp from "../Pages/userPages/ForgotOtp";
import Profile from "../Pages/userPages/Profile"
import Userprotected from "../Pages/userPages/userProtected";
import UserUpdate from "../Pages/userPages/UserUpdate";
import ChangePassword from "../Pages/userPages/ChangePassword";
import Courses from "../Pages/userPages/Courses";
import CartComponent from "../Pages/userPages/Cart";
import PaymentSuccess from "../Pages/userPages/PaymentSuccess";
import PaymentCanceled from "../Pages/userPages/PaymentCancelled";
import { ErrorProvider } from "../Pages/userPages/ErrorBoundary";
import Mycourses from "../Pages/userPages/Mycourses";
import Saved from "../Pages/userPages/Saved";
import EmailUpdate from "../Pages/userPages/EmailUpdate";
import UpdateEmailOtp from "../Pages/userPages/UpdateEmailOtp";
import Tutors from "../Pages/userPages/Tutors";
import InstructorDetails from "../Pages/userPages/InstructorDetails";
import ChatUser from "../Pages/userPages/ChatUser";
import ViewCourse from "../Pages/userPages/ViewCourse";

const UserRoutes = () => {

 

  return (
    <ErrorProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/otp-forgot" element={<ForgotOtp />} />
      <Route path="/otp-emailupdate" element={<Userprotected><UpdateEmailOtp /></Userprotected>} />
      <Route path="/resetPassword" element={<Userprotected><ResetPassword /></Userprotected>} />
      <Route path="/Profile" element={<Userprotected><Profile /></Userprotected>} />
      <Route path="/updateProfile" element={<Userprotected><UserUpdate /></Userprotected>} />
      <Route path="/changepassword" element={<Userprotected><ChangePassword /></Userprotected>} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/tutors" element={<Tutors />} />
      <Route path="/cart" element={<Userprotected><CartComponent courses={[]} /></Userprotected>} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/failed" element={<PaymentCanceled />} />
      <Route path="/mycourses" element={<Userprotected><Mycourses /></Userprotected>} />
      <Route path="/saved" element={<Userprotected><Saved/></Userprotected>} />
      <Route path="/updateEmail" element={<Userprotected><EmailUpdate/></Userprotected>} />
      <Route path="/chatuser" element={<Userprotected><ChatUser/></Userprotected>} />
    <Route path="/WatchCourse/:id" element={<Userprotected><ViewCourse/></Userprotected>} />
      <Route path="/tutors/instructorDetails/:id" element={ <InstructorDetails />}/>
      <Route path="" element />
      <Route path="" element />
      <Route path="" element />
     
    </Routes>
    </ErrorProvider>
  );
};

export default UserRoutes;
