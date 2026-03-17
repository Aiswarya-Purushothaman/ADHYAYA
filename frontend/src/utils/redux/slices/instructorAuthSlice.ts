import { createSlice } from "@reduxjs/toolkit";


const initialState={
  instructorInfo:localStorage.getItem('instructorInfo')? JSON.parse(localStorage.getItem('instructorInfo') as string):null,
}

const instructorAuthSlice = createSlice({
  name: 'instructorAuth',
  initialState,
  reducers: {
    setInstructorDetails: (state, action) => {
      state.instructorInfo = action.payload;
      localStorage.setItem('instructorInfo', JSON.stringify(action.payload));
    },
    logoutinst: (state, action) => {
      state.instructorInfo = null;
      localStorage.removeItem('instructorInfo');
    },
  },
});

export const {setInstructorDetails,logoutinst}=instructorAuthSlice.actions
export const instructorAuthReducer= instructorAuthSlice.reducer