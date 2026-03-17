import jwt from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express'
import dotenv from "dotenv";
import Instructor from '../db/models/instructorSchema';

dotenv.config()
export const instructorAuth=async(req:Request,res:Response,next:NextFunction)=>{
  let token=req.cookies.InstructorAccessToken
  console.log(token,"Tokeninstructor");
  // token= null
  if(!token){
    console.log("no token");
    return res.status(409).json({message:"No Token found"})  
  }
  try {
    const decoded=jwt.verify(token,process.env.JWT_Access_SecretKey as string)
    let userId
    if(decoded && typeof decoded !=="string" && "userId" in decoded){
      userId=decoded.userId
    }
    const user=await Instructor.findById(userId)
if(user){
  if(user.isBlocked==true){
    return res.status(409).json({message:"User is blocked"})
  }
}else{
  return res.status(409).json({message:"User Not Found"})
}
req.body.user=user
next();
  } catch (error) {
    
  }
}