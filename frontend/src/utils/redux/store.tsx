import { configureStore } from "@reduxjs/toolkit";

import {userAuthReducer} from './slices/userAuthSlice'
import { instructorAuthReducer } from "./slices/instructorAuthSlice";
import { adminAuthReducer } from "./slices/adminAuthSlice";



const store=configureStore({
  reducer:{
    userAuth:userAuthReducer,
    instructorAuth:instructorAuthReducer,
    adminAuth:adminAuthReducer
  },
  // middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
  devTools:true,
})

export default store;
