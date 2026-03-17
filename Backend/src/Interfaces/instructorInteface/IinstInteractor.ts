import { ObjectId } from "mongoose";
import { Instructor } from "../../Entities/instructorEntity";
import { Response } from "express";
import { User } from "../../Entities/userEntity";
import { Chat } from "../../Entities/chatEntity";
import { Review } from "../../Entities/reviewEntity";

export interface instructorInteractorInterface {
  SendOtp(email: string): void;
  forgotOtpInst(email: string): void;
  CreateInstructor(data: any): Promise<Instructor | any>;
  loginInstructor(data: any,res:Response): Promise<Instructor | any>;
  updatePassword(data: any): Promise<Instructor | any>;
  updateInstructor(data: any,instructorId:ObjectId): Promise<Instructor | any>;
  changePassword(data: any,instructorId:ObjectId): Promise<Instructor | any>;
  UploadImageInst(data: any,instructorId:ObjectId): Promise<Instructor | any>;
  AddCourse(data: any,instructorId:ObjectId): Promise<Instructor | any>;
  checkInstructor(data: any): Promise<Instructor | any>;
  Mycourse(instructorId:ObjectId): Promise<Instructor | any>;
  updateEmail(userId:ObjectId,email:string):Promise<Instructor | any>;
  RefreshToken(refreshtoken:string,res:Response):Promise<any>;
  UpdateCourse(data:any):Promise<any>;
  FetchMyStudentes(id:ObjectId):Promise<User[]|any>;
  FetchMyEnroll(id:ObjectId):Promise<User[]|any>;
  fetchMessages(userId:ObjectId,receiverId:ObjectId):Promise<Chat[]|any>;
  ReviewReply(reviewId:string,reply:string):Promise<Review|any>;
  deleteChat(data:any):Promise<Chat|any>;
  onFetchAllReviews():Promise<Review|any>;
}
