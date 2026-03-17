import mongoose, { ObjectId } from "mongoose";

interface EnrolledCourse{
  courseId:mongoose.Types.ObjectId,
  progress:number,
  isCompleted:boolean,

}



export class Enrollments{
  constructor(
    public readonly _id: ObjectId,
    public readonly studentId: ObjectId,
    public readonly Courses:EnrolledCourse[],
    public readonly Total:number,
    public readonly EnrolledAt:Date


  ){}
}