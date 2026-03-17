import { promises } from "dns";
import { User } from "../../Entities/userEntity";
import { ObjectId, Schema } from "mongoose";
import { Course } from "../../Entities/courseEntity";
import { Enrollments } from "../../Entities/enrollmentEntity";
import { Instructor } from "../../Entities/instructorEntity";
import { Chat } from "../../Entities/chatEntity";
import { Review } from "../../Entities/reviewEntity";

export interface studentRespositoryInterface {
  userRegister(data: any): Promise<User>;
  registerGoogleUser(data: any): Promise<User>;
  findUser(email: string): Promise<User>;
  findById(id:ObjectId): Promise<User>;
  findMyinst(instructorId: any[]):Promise<Instructor[]>
  fetchEnrolled(id:ObjectId): Promise<Enrollments[]>;
  userExist(email: string): Promise<User>;
  updateById(id: ObjectId, data: any): Promise<User>;
  updateModuleProgress(enrollmentId:string,courseId:ObjectId,sectionId:string,progress:number):Promise<Enrollments|null>
  fetchCourseUser(): Promise<Course>;
  fetchAllReview(): Promise<Review>;
  Enroll(data:any): Promise<Enrollments>;
  findReviewDelete(reviewId:string):Promise<Review|any>;
  findChatDelete(ChatId:string):Promise<Chat|any>;

  findCartCourse(ids: Schema.Types.ObjectId[]|any):Promise<Course>;
  fetchRoom(userId:ObjectId,receiverId:ObjectId):Promise<Chat[]|any>;
  CreateReview(userId:ObjectId,data:any):Promise<Review|any>;
}
