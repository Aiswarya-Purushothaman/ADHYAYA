import Cookies from "js-cookie"
import { logout } from "../utils/redux/slices/userAuthSlice"
import { logoutinst } from "../utils/redux/slices/instructorAuthSlice"

export function LogoutStudent(dispatch:any){
 Cookies.remove('StudentAccessToken')
 Cookies.remove('StudentRefreshToken')
 dispatch(logout({}))
}

export function LogoutInstructor(dispatch:any){
 Cookies.remove('InstructorAccessToken')
 Cookies.remove('InstructorRefreshToken')
 dispatch(logoutinst({}))
}