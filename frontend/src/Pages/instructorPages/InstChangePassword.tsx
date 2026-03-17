import React, { useState } from 'react'
import "../../style/resetpassword.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import {InstchangePassword} from '../../utils/Axios/api'
import {  useSelector } from 'react-redux';
import { useError } from './InstErrorBoundary';




const ChangePassword = () => {
  const { instructorInfo } = useSelector((state: any) => state.instructorAuth);

  const throwError=useError()

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const navigate=useNavigate()
 


  const handleSubmit =async (e: any) => {
    e.preventDefault();
 

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
   

    if (newPass.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (!specialCharRegex.test(newPass)) {
      toast.error("New password must contain at least one special character");
      return;
    }



    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      
     const response=await InstchangePassword({currentPass:currentPass,newPass:newPass})
      console.log(response,'response')
     if(response){
      toast.success("Password updated successfully");
      navigate("/instructor/profile")
     }
    } catch (error:any) {
      console.log(error)
      const message=error.response.data.message
      console.log(error,"erorrorororr");
      throwError(message)
      toast.error(error.response.data)
      // console.error("Error updating password:", error);
    }
  };

  return (
    <>
    <div className='h-screen w-screen flex items-center justify-center bg-orbitr '>
      <div className='bg-gradient-to-br from-red-600 to-pink-500 h-96  w-96 flex flex-col items-center justify-center p-16 rounded-lg shadow-2xl z-10 animate-dropIn'>
      
        <h2 className="text-3xl  text-white mb-4">Reset Password</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-white mx-2 text-sm font-medium mb-2">Current Password</label>
            <input 
              type="password" 
              id="current-password" 
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="bg-white rounded-full text-black p-1 focus:outline-none w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white text-sm mx-2 font-medium mb-2">Enter New Password</label>
            <input 
              type="password" 
              id="new-password" 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="bg-white rounded-full text-black p-1 focus:outline-none w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white text-sm font-medium mx-2 mb-2">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="bg-white rounded-full text-black p-1 focus:outline-none w-full"
            />
          </div>
          <button 
            type="submit" 
            className="w-48 mx-9 py-1 mt-4 bg-white text-red-600 rounded-full hover:text-white hover:bg-gradient-to-br from-red-600 to-pink-500 transition duration-300"
          >
            Update Password
          </button>
        </form>
        <Link to={"/instructor/instForgotPassword"} className="text-white mt-4 hover:underline">Forgot Password?</Link>
      </div>
    </div>
  </>
  )
}

export default ChangePassword
