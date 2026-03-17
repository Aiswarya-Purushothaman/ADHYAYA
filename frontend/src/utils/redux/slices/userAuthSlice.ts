import { createSlice } from "@reduxjs/toolkit";


const initialState={
  userInfo:localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo') as string):null,
}

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const {setUserDetails,logout}=userAuthSlice.actions
export const userAuthReducer= userAuthSlice.reducer