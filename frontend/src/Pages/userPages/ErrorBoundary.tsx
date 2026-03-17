import React, { createContext, useState, useContext } from 'react';
import { ChildrenProps, ErrorHandler } from '../../utils/types';
import { userRefreshToken } from '../../utils/Axios/api';
import { logout } from '../../utils/redux/slices/userAuthSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ErrorContext = createContext<ErrorHandler>(()=>{});

export const ErrorProvider:React.FC<ChildrenProps>=({ children })=> {

  const [error, setError] = useState(null);
 const [hasError,setHasError]=useState(false)

  const throwError = (error:any) => {
    setError(error);
    if(error==="No Token found" ){
      setHasError(true) 
      }else{
 return 
      }
  };

 const navigate=useNavigate()
 const dispatch=useDispatch()

 const HandleRefreshToken=async ()=>{
  try {
    const update=await userRefreshToken()
    console.log(update,"update");
    
    if(update){
      setHasError(false)
      window.location.reload()
    }
  } catch (error:any) {
 if(error?.response?.data?.message==="No refreshToken"){
  dispatch(logout(null))
 setHasError(false) 
 navigate ("/login")
 }
    
  }


}



const ErrorComponent=()=>{
  return (
    <div>
      <h1>Something Wrong</h1>
      <button className='bg-blue-400' onClick={HandleRefreshToken}>Refresh</button>
    </div>
  )
}

  return (
    <ErrorContext.Provider value={throwError}>
      {hasError? ErrorComponent():children}
    </ErrorContext.Provider>
  );
}

export  const useError=()=> {
  console.log('context')
  return useContext(ErrorContext);
}
