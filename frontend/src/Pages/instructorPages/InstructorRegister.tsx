import "../../style/instReg.css";
import { sendOtpInst } from "../../utils/Axios/api";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'
import { googleRegister } from "../../utils/types";
import { useDispatch } from "react-redux";
import { setInstructorDetails } from "../../utils/redux/slices/instructorAuthSlice";
import { instructorRegister } from "../../utils/Axios/api";

const InstructorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const clientId =
    "816516521603-uqgmj2l5rb37f09h67ob8sn5ark8jfal.apps.googleusercontent.com";

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [contactError, setContactError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
  

  const navigate = useNavigate();
  const dispatch=useDispatch()

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateDescription = (description: string) => {
    const descriptionRegex =
      /^[a-zA-Z0-9\s.,'!@#$%^&*()_+=[\]{}|;:"<>?\/\\-]{10,300}$/;
    return descriptionRegex.test(description);
  };

  const validateContact = (contact: string) => {
    const contactRegex = /^(\d{10}|(\d{3}[-\s]?\d{3}[-\s]?\d{4})|(\(\d{3}\)\s?\d{3}[-\s]?\d{4}))$/;
    return contactRegex.test(contact);
  };
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const HandleRegister = async (e: any) => {
    console.log("hey there");

    e.preventDefault();
    let hasError = false;

    if (!validateName(name)) {
      setNameError("Name should contain only alphabets without spaces");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!validateDescription(description)) {
      setDescriptionError("Invalid description format");
      hasError = true;
    } else {
      setDescriptionError("");
    }

    if (!validateContact(contact)) {
      setContactError("Invalid contact format");
      hasError = true;
    } else {
      setContactError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password should have minimum 8 characters with at least one special character");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }


  if(!hasError) {
      try {
        const details = { name, email, description, contact, password };
        const response = await sendOtpInst({ email });
        console.log(response,"otpotp");
        
        console.log(response.data, "returned otp response  inst");
        localStorage.setItem("secretinst", response.data);
        localStorage.setItem("instructorDetails", JSON.stringify(details));
        navigate("/instructor/inst-otp");
      } catch (err: any) {
        toast.error("Already Used Credentials");      }
    }
  };

  const GoogleRegisterCall =async (res:any) => {
try {
  const details=jwtDecode<googleRegister>(res.credential)
  console.log(details,"details");
  const email=details.email
  const name=details.name
  const profileImage=details.picture
  const googleUserId=details.sub
  const instructor=await instructorRegister({name:name,email:email,profileImage:profileImage,googleUserId:googleUserId})
 console.log(instructor,"instructor");
 
  if(instructor.data){
    dispatch(setInstructorDetails(instructor.data))
    navigate('/instructor/login')
  }
} catch (error) {
  toast.error("Mail Already Exits")
}
      };
      useEffect(() => {
        const initializeGoogleSignIn = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: GoogleRegisterCall,
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
      <div className="flex relative h-screen ">
        <div className="flex-1 h-full bg-gradient-to-br from-red-600 to-pink-500">
          <div className="py-64 ml-10">
            <h3 className=" text-xl text-white">Start Teaching Today !</h3>
            <h6 className="text-xs  text-white">
              Only The Brave Choose To Teach.
            </h6>
          </div>
        </div>
        <div className="flex-1 h-full  bg-white bg-instreg "></div>

        <div className="absolute inset-0  flex items-center justify-center">
          <div className="bg-white   rounded-lg custom-shadow max-w-md w-full z-10">
            <h2 className="text-2xl font-bold  text-center">
              Instructor Sign Up
            </h2>
            <form className="p-4" onSubmit={HandleRegister}>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">Name</label>
                <input
                  type="text"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full "
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                  {nameError && <p className="text-red-500 text-xs px-3">{nameError}</p>}
              </div>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full  "
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-xs px-3">{emailError}</p>}
              </div>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">
                  Description
                </label>
                <input
                  type="description"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full  "
                  placeholder="Enter your description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                 {descriptionError && <p className="text-red-500 text-xs px-3">{descriptionError}</p>}
              </div>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full  "
                  placeholder="Enter your contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                   {contactError && <p className="text-red-500 text-xs px-3">{contactError}</p>}
              </div>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full "
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                 {passwordError && <p className="text-red-500 text-xs px-3">{passwordError}</p>}
              </div>
              <div className="mb-1">
                <label className="block text-sm px-3 text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className=" bg-gray-200  rounded-full text-black p-1  focus:outline-none w-full "
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && <p className="text-red-500 text-xs px-3">{confirmPasswordError}</p>}
              </div>
              <button
                type="submit"
                className="w-full h-10 mt-4 bg-gradient-to-br from-red-600 to-pink-500 text-white rounded-full hover:text-black transition duration-300"
              >
                Get Started
              </button>
            </form>
            <div className="px-32 ">
            <div id="googlebutton" ></div>
            </div>
          
            <p className=" text-center text-gray-700">
              Already have an account?{" "}
              <Link to={"/instructor/login"} className="text-red-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorRegister;
