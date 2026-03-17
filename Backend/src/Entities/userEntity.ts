import mongoose, { ObjectId } from "mongoose";

export class User {
  constructor(
    public readonly _id: ObjectId,
    public readonly name: string,
    public readonly email: string,
    public readonly contact: number,
    public readonly password: string,
    public readonly profileImage: string,
    public readonly isBlocked: boolean,
    public readonly enrollments:mongoose.Types.ObjectId[],
    public readonly reviews:mongoose.Types.ObjectId[],
    public readonly cart: { courseId: ObjectId }[],
    public readonly saved: { courseId: ObjectId }[],
    public readonly googleUserId?: string,

   
  ) {}
}
