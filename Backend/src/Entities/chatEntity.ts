import { ObjectId } from "mongoose";

export class Chat {
  constructor(
    public readonly _id: ObjectId,
    public readonly sender: object,
    public readonly receiver: object,
    public readonly message: string,
    public readonly Time: string,
    public readonly type:string
  ) {}
}