import { ObjectId } from "mongoose";

export class Instructor {
  constructor(
    public readonly _id: ObjectId,
    public readonly name: string,
    public readonly email: string,
    public readonly description: string,
    public readonly contact: number,
    public readonly password: string,
    public readonly profileImage: string,
    public readonly isBlocked: boolean,
    public readonly googleUserId: string,
    public readonly courses:{courseId:ObjectId}[],
  ) {}
}
