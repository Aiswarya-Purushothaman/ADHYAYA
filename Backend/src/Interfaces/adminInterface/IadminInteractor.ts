import { User } from "../../Entities/userEntity";
import { Admin } from "../../Entities/adminEntity";
import { Response } from "express";
import { Course } from "../../Entities/courseEntity";
import { AnyArray } from "mongoose";
import { Instructor } from "../../Entities/instructorEntity";


export interface adminInteractorInteface {
  approveCourse(data:any):  Promise<Course | any>;
  RejectCourse(data:any):  Promise<Course | any>;
  loginAdmin(data: any,res:Response): Promise<User | any>;
  updatePassword(data: any): Promise<User | any>;
  changeStatusUser(data: any): Promise<User | any>;
  changeStatusInstructor(data: any): Promise<User | any>;
  forgotAdminotp(email: string): void;
  fetchStudents(): Promise<User | any>;
  fetchInstructors(): Promise<Instructor | any>;
  fetchAllcourses(): Promise<Course | any>;
  fetchInstructor(data:any): Promise<Instructor | any>;
  RefreshToken(refreshtoken:string,res:Response):Promise<any>;
}
