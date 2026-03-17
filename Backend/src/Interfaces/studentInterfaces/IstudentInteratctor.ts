import { AnyExpression, ObjectId } from "mongoose";
import { User } from "../../Entities/userEntity";
import { Response } from "express";
import { Course } from "../../Entities/courseEntity";
import { Instructor } from "../../Entities/instructorEntity";
import { Chat } from "../../Entities/chatEntity";
import { Review } from "../../Entities/reviewEntity";

export interface studentInteractorInterface {
  createUser(data: any): Promise<User | any>;
  loginUser(data: any,res:Response): Promise<User | any>;
  sendOtp(email: string): void;
  forgotOtp(email: string): void;
  updatePassword(data: any): Promise<User | any>;
  sectionProgress(data: any,userId:ObjectId): Promise<User | any>;
  checkUser(data: any): Promise<User | any>;
  unCart(data: any): Promise<User | any>;
  removeSaved(data: any): Promise<User | any>;
  updateUser(data: any,userId:ObjectId): Promise<User | any>;
  changePassword(data: any,userId:ObjectId): Promise<User | any>;
  uploadImageStudent(userId:ObjectId,data:any):Promise<User | any>;
  updateEmail(userId:ObjectId,email:string):Promise<User | any>;
  fetchCourse():Promise<Course|any>
  addCart(data:any): void;
  addSaved(data:any): void;
  fetchCart(id:ObjectId):Promise<Course|any>;
  FetchMyInstructor(id:ObjectId):Promise<Instructor[]|any>;
  fetchMycourses(id:ObjectId):Promise<Course|any>;
  Success(id:ObjectId,total:number):Promise<any>;
  SubmitcourseReview(id:ObjectId,data:any):Promise<Review|any>;
  FetchAllReviews():Promise<Review|any>;
  deleteReview(data:any):Promise<Review|any>;
  deleteChat(data:any):Promise<Chat|any>;
  checkOut(courses:any,Total:any):Promise<any>;
  RefreshToken(refreshtoken:string,res:Response):Promise<any>;
  fetchMessages(userId:ObjectId,receiverId:ObjectId):Promise<Chat[]|any>;
}
