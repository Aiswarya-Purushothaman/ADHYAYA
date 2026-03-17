import "../../style/instLogin.css";
import { instructorLogin } from "../../utils/Axios/api";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setInstructorDetails } from "../../utils/redux/slices/instructorAuthSlice";
import { googleRegister } from "../../utils/types";
import {jwtDecode} from 'jwt-decode'
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const InstructorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const clientId =
  "816516521603-uqgmj2l5rb37f09h67ob8sn5ark8jfal.apps.googleusercontent.com";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitLogin = async (e: any) => {
    e.preventDefault();
    // console.log("login aTtempt",{email,password});

    if (!email || !password) {
      console.log("Missing email or password");
      toast.error("Email and password are required");
      return;
    }
    try {
      // console.log("the tr");
      const response = await instructorLogin({ email, password });
      // console.log(response,"login res");
      if (response.data) {
        dispatch(setInstructorDetails(response.data));
        toast.success("Login successful");
        navigate("/instructor/dashboard");
      } else {
        toast.error("Login failed: " + response.data.message);
      }
    } catch (err: any) {
      console.log(err, "errr hain");
      if (err.response && err.response.data && err.response.data.message) {
        toast.error("Error: " + err.response.data.message);
      } else {
        toast.error("wrong credentials ");
        // toast.error("wrong credentials " + err.message);
      }
    }
  };

  const GoogleLoginCall =async (res:any) => {
    try {
      const details=jwtDecode<googleRegister>(res.credential)
      console.log(details,"details");
      const email=details.email
      const googleUserId=details.sub
      const response=await instructorLogin({email:email,googleUserId:googleUserId})
     console.log(response,"instructor");
     if (response.data) {
      dispatch(setInstructorDetails(response.data));
      toast.success("Login successful");
      navigate("/instructor/dashboard");
    } else {
      toast.error("Login failed: " + response.data.message);
    }
    } catch (err:any) {
      console.log(err, "errr hain");
      if (err.response && err.response.data && err.response.data.message) {
        toast.error("Error: " + err.response.data.message);
      } else {
        toast.error("wrong credentials ");
        // toast.error("wrong credentials " + err.message);
      }
    }

  }

  useEffect(() => {
    const accessToken = Cookies.get("InstructorAccessToken");
    if(accessToken){
      navigate("/instructor/dashboard")
    }else{
      navigate('/instructor/login')
    }
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: GoogleLoginCall,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googlebutton'),
          {theme:'outline',size:'medium'}
        )
        window.google.accounts.id.prompt()
      }
    };
    const existingScript = document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script)
        } else {
            initializeGoogleSignIn();
        }
    // initializeGoogleSignIn()
  }, []);





  return (
    <>
      {" "}
      <div className="bg-white flex items-center justify-center min-h-screen adminLogin p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl ">
          <div className="bg-white text-white p-8 md:w-1/2 w-full flex flex-col justify-center custom-shadow ">
            <h2 className="text-2xl font-bold mb-8 text-black">
              Instructor In
            </h2>
            <form onSubmit={submitLogin}>
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1 px-3 text-black">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1 px-3 text-black">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="bg-gradient-to-br from-red-600 to-pink-500 text-white  px-4 py-2 ml-36 rounded-full hover:bg-white hover:text-black transition duration-300">
                Sign In
              </button>
            </form>
            <div className="px-28 mt-3 ">
            <div id="googlebutton" ></div>
            </div>

            <div className="flex items-center justify-between mt-6 mb-4">
              <div className="custom-checkbox flex items-center">
                <input
                  type="checkbox"
                  id="remember_me"
                  name="remember_me"
                  className="mr-2"
                />
                <label className="text-sm text-transparent bg-gradient-to-br from-red-600 hover:underline to-pink-500 bg-clip-text">
                  Remember me
                </label>
              </div>
              <Link
                to={"/instructor/instForgotPassword"}
                className="text-sm text-gray-500 hover:text-black transition duration-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-pink-500 text-white p-4 md:w-1/2 w-full flex items-center justify-center">
            <div className="flex flex-col text-center items-center justify-center">
              <h1 className="text-4xl font-bold">Be the Influence</h1>
              <p className="text-1xl font-custom">Don't Have An Account As Intructor?</p>
              <Link to={"/instructor/register"} className="mt-4 border-r px-4 py-2 bg-gradient-to-br from-red-600 to-pink-500 font-medium text-white rounded-full hover:text-black transition duration-300 border-2">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorLogin;
