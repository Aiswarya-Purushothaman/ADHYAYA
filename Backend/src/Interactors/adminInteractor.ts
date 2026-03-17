import { User } from "../Entities/userEntity";
import { adminInteractorInteface } from "../Interfaces/adminInterface/IadminInteractor";
import { adminRepositoryInterface } from "../Interfaces/adminInterface/IadminRepository";
import bcrypt from "bcryptjs";
import { sendMail } from "../Helpers/nodemailer";
import { Response } from "express";
import { generateAcessToken, generateRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export class adminInteractor implements adminInteractorInteface {
  private repository: adminRepositoryInterface;
  constructor(repository: adminRepositoryInterface) {
    this.repository = repository;
  }
  async RefreshToken(refreshtoken: string,res:Response) {
    const identity="Admin"
    console.log(identity,'helloooooooo')
     const decoded =jwt.verify(refreshtoken,process.env.JWT_Refresh_SecretKey as string)
     let userId
     if(decoded && typeof decoded !=="string" && "userId" in decoded){
      userId=decoded.userId
    }
  const user=await this.repository.findById(userId)
  if(user){
    generateAcessToken(res, user._id.toString(), identity);
    generateRefreshToken(res, user._id.toString(), identity);
    return user;
  }else{
    throw new Error("No refreshToken")
  }
  
    }



 async fetchInstructor(data: any) {
  const instructor=await this.repository.findByIdInst(data.id)
  return instructor
  }


  async RejectCourse(data: any) {
    const course=await this.repository.findCourseById(data.id)
  
   if(course){
      const course=await this.repository.findCourseAndUpdateById(data.id,{isApproved:"rejected"})
      console.log(course,"coursecourse");
      return course
    
   }
  }


 async approveCourse(data: any) {
  console.log(data,"sgadbnxdhnxn");
  
   const course=await this.repository.findCourseById(data.id)
   console.log(course,"coursecourse4567");
   if(course){
      const course=await this.repository.findCourseAndUpdateById(data.id,{isApproved:"approved"})
      console.log(course,"coursecourse");
      return course
    
   }
  }
  
 async fetchAllcourses() {
    const course=await this.repository.AllCourses()
    return course
  }

 async changeStatusInstructor(data: any) {
   const user=await this.repository.findByIdInst(data.id)
   console.log(user,"user");
   if(user){
    const user=await this.repository.updateByIdInst(data.id,{isBlocked:data.status})
    console.log(user,"useruser");
    return user
   }
  }
 async changeStatusUser(data: any) {
   const user=await this.repository.findById(data.id)
   console.log(user,"user");
   if(user){
    const user=await this.repository.updateByIdUser(data.id,{isBlocked:data.status})
    console.log(user,"useruser");
    return user
   }
  }
 async fetchStudents() {
  const students=await this.repository.fetchAllStudents()
    return students
  }
  
 async fetchInstructors() {
  const instructors=await this.repository.fetchAllInstructors()
    return instructors
  }

  async updatePassword(data: any) {
    const admin = await this.repository.adminExist(data.email);
    const adminId = admin._id;
    if (admin) {
      const newpass = data.newpass;
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(newpass, salt);
      console.log(encrypted, "encrypted");
      const admin = await this.repository.updateById(adminId, {
        password: encrypted,
      });
      return admin;
    }
  }

  async forgotAdminotp(email: string) {
    const admin = await this.repository.adminExist(email);
    console.log(admin, "admin in interactor");

    if (admin) {
      const otp = await sendMail(email);
      console.log(otp, "otp");
      return otp;
    }
    throw new Error("invalid email");
  }

  async loginAdmin(data: any, res:Response) {
    const identity="Admin"
    const user = await this.repository.adminExist(data.email);
    if (user) {
      const originalpass = user.password;
      const enteredpass = data.password;
      const match = await bcrypt.compare(enteredpass, originalpass);
      if (match) {
        generateAcessToken(res, user._id.toString(), identity);
        generateRefreshToken(res, user._id.toString(), identity);
        return user;
      } else {
        console.log("wrong password");
        throw new Error("wrong password");
      }
    } else {
      console.log("no admin");
      throw new Error("Admin doesnt exist");
    }
  }
}
