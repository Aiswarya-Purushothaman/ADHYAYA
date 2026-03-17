import React, { useState, useEffect, useRef } from "react";
import "../../style/otp.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, sendOtp } from "../../utils/Axios/api";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    const storedOtp = localStorage.getItem("secret");
    const userDetails = localStorage.getItem("userdetails");

    if (enteredOtp === storedOtp) {
      console.log("OTP is a match");
      localStorage.removeItem("secret");
      if (userDetails) {
        const parsedDetails = JSON.parse(userDetails);

        try {
          const response = await registerUser(parsedDetails);
          if (response) {
            // dispatch(setUserDetails(response.data));
            toast.success("User registered successfully");
            localStorage.removeItem("userdetails");
            navigate("/login");
          }
        } catch (error) {
          console.error("Registration failed", error);
          toast.error("Registration failed");
        }
      } else {
        
        toast.error("User details not found");
      }
    } else {
      console.error("Incorrect OTP");
      toast.error("Incorrect OTP");
    }
  };

  const handleResendOtp = async () => {
     
    setTimeLeft(30);
    setIsResendEnabled(false);
    const userDetails = localStorage.getItem("userdetails");
    if(userDetails){
      const parsedDetails=JSON.parse(userDetails)
      console.log(parsedDetails,"parsedDetailsparsedDetails");
      const email=parsedDetails.email
      const otp=await sendOtp({email})
      console.log(otp.data,"otpotp");
      localStorage.setItem("secret",otp.data)
    }

  };

  return (
    <div className="h-screen w-screen flex items-center justify-center orbit-otp">
      <div className="bg-gradient-to-br from-red-600 to-pink-500 h-96 w-96 flex flex-col items-center justify-center p-6 rounded-lg shadow-2xl z-10 animate-dropIn">
        <img
          src="https://sendy.colorlib.com/img/email-notifications/subscribed.gif"
          alt="Check your email"
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-2xl text-white mb-4">Email Verification</h2>
        <p className="text-white text-center mb-4">
          We have sent a verification code to your email. Please enter the
          4-digit code below.
        </p>
        <form onSubmit={handleOtpSubmit}>
          <div className="flex justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                maxLength={1}
                className="otp-input bg-gray-100"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-gray-100 p-1 rounded-2xl text-pink-800 hover:bg-gradient-to-br from-red-600 ml-14 to-pink-500 hover:text-white hover:border"
          >
            Verify
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-white text-xs mt-3">Didn't receive the code?</p>
          {!isResendEnabled ? (
            <p id="timer" className="text-white mt-1">
              You can resend OTP in {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? "0" : ""}
              {timeLeft % 60}
            </p>
          ) : (
            <button
              id="resendButton"
              onClick={handleResendOtp}
              className="text-white hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otp;
