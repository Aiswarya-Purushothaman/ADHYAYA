import jwt from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express'
import dotenv from "dotenv";
import Admin from '../db/models/adminSchema';

dotenv.config()
export const AdminAuth=async(req:Request,res:Response,next:NextFunction)=>{
  const token=req.cookies.AdminAccessToken
  
  console.log(token,"TokenAdmin");
  
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
    const user=await Admin.findById(userId)
if(!user){
  return res.status(409).json({message:"User Not Found"})
}
req.body.user=user
next();
  } catch (error) {
    
  }
}