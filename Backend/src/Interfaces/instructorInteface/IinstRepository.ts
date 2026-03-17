import { promises } from "dns";
import { Instructor } from "../../Entities/instructorEntity";
import { ObjectId } from "mongoose";
import { Course } from "../../Entities/courseEntity";
import { Enrollments } from "../../Entities/enrollmentEntity";
import { User } from "../../Entities/userEntity";
import { Chat } from "../../Entities/chatEntity";
import { Review } from "../../Entities/reviewEntity";

export interface instructorRepositoryInterface {
  findInstructor(data: any): Promise<Instructor>;
  instructorRegister(data: any): Promise<Instructor>;
  googleInstRegister(data: any): Promise<Instructor>;
  CreateCourse(data: any,instructorId:ObjectId): Promise<Course>;
  instructorExist(data: any): Promise<Instructor>;
  updateById(id: ObjectId, data: any): Promise<Instructor>;
  updateCourseById(id: ObjectId, data: any): Promise<Course>;
  findById(id:ObjectId): Promise<Instructor>;
  fetchCourses():Promise<Course>;
  matchStudents(courseIds: any[]):Promise<User>
  EnrollPrice(courseIds: any[]):Promise<Course[]>
  fetchEnrollments(courseIds: any[]):Promise<{_id:string,count:number}[]>
  fetchRoom(userId:ObjectId,receiverId:ObjectId):Promise<Chat[]|any>;
  findReview(reviewId:string):Promise<Review|any>;
  updateReview(reviewId:string,data:any):Promise<Review|any>;
  fetchAllReviews(): Promise<Review>;
  findChatDelete(ChatId:string):Promise<Chat|any>;
}
