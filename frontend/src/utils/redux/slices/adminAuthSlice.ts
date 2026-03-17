import { createSlice } from "@reduxjs/toolkit";


const initialState={
  adminInfo:localStorage.getItem('adminInfo')? JSON.parse(localStorage.getItem('adminInfo') as string):null,
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminDetails: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem('adminInfo', JSON.stringify(action.payload));
    },
    logoutAdmin: (state, action) => {
      state.adminInfo = null;
      localStorage.removeItem('adminInfo');
    },
  },
});

export const {setAdminDetails,logoutAdmin}=adminAuthSlice.actions
export const adminAuthReducer= adminAuthSlice.reducer