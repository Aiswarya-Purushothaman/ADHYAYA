import { Schema } from "mongoose";
import AdminSchema from "../db/models/adminSchema";
import { Admin } from "../Entities/adminEntity";
import { adminRepositoryInterface } from "../Interfaces/adminInterface/IadminRepository";
import UserSchema from "../db/models/studentSchema";
import InstructorSchema from "../db/models/instructorSchema";
import { User } from "../Entities/userEntity";
import { Instructor } from "../Entities/instructorEntity";
import { Course } from "../Entities/courseEntity";
import CourseSchema from "../db/models/courseSchema";


export class adminRepository implements adminRepositoryInterface {
  private adminDB: typeof AdminSchema;
  private userDB: typeof UserSchema;
  private InstructorDB: typeof InstructorSchema;
  private courseDB:typeof CourseSchema;
  constructor() {
    this.adminDB = AdminSchema;
    this.userDB = UserSchema;
    this.InstructorDB = InstructorSchema;
    this.courseDB= CourseSchema;

  }


  async findCourseAndUpdateById(id: Schema.Types.ObjectId, data: any): Promise<Course|any> {
    const course = await this.courseDB.findByIdAndUpdate(id, data, { new: true });
    console.log(course,"gybuyghgyuh");
    return course;
  }


 async findCourseById(id: Schema.Types.ObjectId): Promise<Course|any> {
    const course=await this.courseDB.find({id})
    return course
  }

 async AllCourses(): Promise<Course|any> {
    const courses=await this.courseDB.find()
    return courses
  }
 
  async updateById(id: Schema.Types.ObjectId, data: any): Promise<Admin | any> {
    const admin = await this.adminDB.findByIdAndUpdate(id, data, { new: true });
    return admin;
  }

  async adminExist(email: string): Promise<Admin | any> {
    const admin = await this.adminDB.findOne({ email });
    console.log(admin, "data in repo");
    return admin;
  }


  async updateByIdUser(id: Schema.Types.ObjectId, data: any): Promise<User | any> {
    const user = await this.userDB.findByIdAndUpdate(id, data, { new: true });
    return user;
  }
  async updateByIdInst(id: Schema.Types.ObjectId, data: any): Promise<Instructor | any> {
    const instructor = await this.InstructorDB.findByIdAndUpdate(id, data, { new: true });
    return instructor;
  }



  async fetchAllInstructors() {
    const instructors=await this.InstructorDB.find()
    console.log(instructors,"instructors in repo");
    return instructors
  }

  async fetchAllStudents() {
    const students=await this.userDB.find()
    console.log(students,"students in repo");
    return students
  }

 
  async findById(id: string): Promise<User|any> {
    const user=await this.userDB.findById(id)
    return user
  }
  async findByIdInst(id: string): Promise<User|any> {
    const instructor=await this.InstructorDB.findById(id)
    return instructor
  }
}
