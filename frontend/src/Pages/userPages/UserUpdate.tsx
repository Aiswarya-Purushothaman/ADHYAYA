import "../../style/userUpdate.css";
import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {updateUser} from  '../../utils/Axios/api'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";
import { useError } from "./ErrorBoundary";
import LoadingSpinner from "../../helpers/Loader";


const UserUpdate = () => {

 const throwError =useError()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  
const navigate=useNavigate() 
const [nameError, setNameError] = useState("");
const [emailError, setEmailError] = useState("");
const [contactError, setContactError] = useState("");


const dispatch=useDispatch()
const { userInfo } = useSelector((state: any) => state.userAuth);
console.log(userInfo,"userInfo");
const [isLoading,setIsLoading]=useState(false)

useEffect(()=>{

  setIsLoading(true)  
  setName(userInfo.name)
  setEmail(userInfo.email)
  setContact(userInfo.contact)
  setIsLoading(false)


},[userInfo.name,userInfo.email,userInfo.contact])

const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z]+$/;
  return nameRegex.test(name);
};


const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateContact = (contact: string) => {
  const contactRegex =
    /^(\d{10}|(\d{3}[-\s]?\d{3}[-\s]?\d{4})|(\(\d{3}\)\s?\d{3}[-\s]?\d{4}))$/;
  return contactRegex.test(contact);
};

const submitHandler=async (e:any)=>{
  e.preventDefault()


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

  if (!validateContact(contact)) {
    setContactError("Invalid contact format");
    hasError = true;
  } else {
    setContactError("");
  }
  if(!hasError){
    try {
      const response=await updateUser({id:userInfo._id,name:name,email:email,contact:contact})
      console.log(response,"response");
      if(response){
        dispatch(setUserDetails(response.data))
        toast.success("updated successfully")
      }else{
        toast.error("something went wrong")
      }
      
      navigate('/profile')
    } catch (error:any) {
      const message=error?.response?.data?.message
      console.log(error,"erorrorororr");
      throwError(message)
      toast("something went wrong")
    }
  }


  
  
}

  return (
    <>
    <div className="flex relative h-screen update-orbit">
      <div className="flex-1 h-full bg-white"></div>

      <div className="flex-1 h-full bg-gradient-to-br from-red-600 to-pink-500"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg custom-shadow max-w-md w-full z-10">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Update Profile
          </h2>

          {isLoading ? (
            
            <LoadingSpinner />
          ) : (
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-sm font-medium px-2 text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none w-full"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {nameError && (
                  <p className="text-red-500 text-xs px-3">{nameError}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium px-2 text-gray-700">
                  Contact
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  type="text"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none w-full"
                  placeholder="Contact Number"
                  required
                />
                {contactError && (
                  <p className="text-red-500 text-xs px-3">
                    {contactError}
                  </p>
                )}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-br from-red-600 to-pink-500 text-white px-4 py-2 rounded-full hover:text-black"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default UserUpdate;
