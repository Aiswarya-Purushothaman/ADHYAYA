import { ObjectId } from "mongoose";
import { Admin } from "../../Entities/adminEntity";
import { User } from "../../Entities/userEntity";
import { Instructor } from "../../Entities/instructorEntity";
import { Course } from "../../Entities/courseEntity";
export interface adminRepositoryInterface {
  adminExist(email: string): Promise<Admin>;
  updateById(id: ObjectId, data: any): Promise<Admin>;
  updateByIdUser(id: ObjectId, data: any): Promise<User>;
  updateByIdInst(id: ObjectId, data: any): Promise<Instructor>;
  fetchAllStudents(): Promise<User | any>;
  fetchAllInstructors(): Promise<Instructor | any>;
  findById(id:string): Promise<User>;
  findByIdInst(id:string): Promise<Instructor>;
  AllCourses(): Promise<Course>;
  findCourseById(id:ObjectId): Promise<Course>;
  findCourseAndUpdateById(id:ObjectId,data:any): Promise<Course>;
 
}
