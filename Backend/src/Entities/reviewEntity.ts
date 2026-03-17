import { Date, ObjectId } from "mongoose";

export class Review {
  constructor(
    public readonly _id: ObjectId,
    public readonly studentId: object,
    public readonly courseId: object,
    public readonly comment: string,
    public readonly reply: string,
    public readonly date: Date,
    public readonly rating:number
  ) {}
}