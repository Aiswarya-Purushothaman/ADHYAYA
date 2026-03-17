import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { PurchaseSuccess } from '../../utils/Axios/api';
import { useError } from './ErrorBoundary';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../utils/redux/slices/userAuthSlice';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
const dispatch=useDispatch()
  const handleContinue = () => {
    navigate('/');
  };
  const throwError=useError()

  useEffect(()=>{
   
    const Success=async ()=>{
      try {
        const total:any= localStorage.getItem("Total")
     const Total=parseInt(total)
     
     
      const response=await PurchaseSuccess({Total})
if(response.data){
  localStorage.removeItem("Total");
  console.log(response.data,"response.data");
  
  dispatch(setUserDetails(response.data))
}
      } catch (error:any) {
        const message=error?.response?.data?.message
      console.log(error,"erorrorororr");
      throwError(message)
      }
     
    }
    Success();
  },[])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="https://img.freepik.com/premium-photo/green-check-mark-with-green-box-isolated_698953-12892.jpg"
        alt="Success Tick"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-3xl font-semibold mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
      <button
        onClick={handleContinue}
        className="bg-gradient-to-br from-green-600 to-green-400 text-white py-2 px-6 rounded-md hover:bg-green-500"
      >
        Continue
      </button>
    </div>
  );
};

export default PaymentSuccess;
