import { useState } from "react";
import "../../style/forgot.css";
import { ForgotOtpStudent } from "../../utils/Axios/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const ForgotHandle = async (e: any) => {
    e.preventDefault();
    try {
      const data = { email };
      const response = await ForgotOtpStudent({ email });
      console.log(response);
      console.log(response.data, "returned otp response");
      localStorage.setItem("otpforgot", response.data);
      localStorage.setItem("data", data.email);
      navigate("/otp-forgot");
    } catch (error: any) {
      console.log(error.response.data);

      toast.error(error.response.data);
    }
  };
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center email-orbit">
        <div className="h-screen bg-gradient-to-br from-red-600 to-pink-500 w-screen flex justify-center items-center ">
          <div className="h-auto w-96 bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-2xl z-10 animate-dropIn">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUC_MFpUdnCTQAsQLJdOyU4-5L4DE3B13MAw&s"
              alt="Forgot Password"
              className="mb-6 w-24 h-24 object-cover rounded-full"
            />
            <h2 className="text-2xl font-custom mb-8 text-black">
              Forgot Password
            </h2>
            <form className="w-full p-4" onSubmit={ForgotHandle}>
              <div className="mb-4">
                <label className="block text-sm ml-3 mb-2">
                  Enter Your Email ID
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none w-full v"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-24 py-2 mt-6 ml-24 bg-gradient-to-br from-red-600 to-pink-500 text-white rounded-full hover:text-black transition duration-300"
              >
                Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
