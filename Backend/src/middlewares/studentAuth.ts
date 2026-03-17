import jwt from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express'
import dotenv from "dotenv";
import User from '../db/models/studentSchema';

dotenv.config()

export const studentAuth= async (req:Request,res:Response,next:NextFunction)=>{
  const token=req.cookies.StudentAccessToken
//  token=null

  if(!token){
    console.log("no token in student");
    return res.status(409).json({message:"No Token found"})  
  }
  try {
    const decoded=jwt.verify(token,process.env.JWT_Access_SecretKey as string)
    let userId
    if(decoded && typeof decoded !=="string" && "userId" in decoded){
      userId=decoded.userId
    }
    const user=await User.findById(userId)
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