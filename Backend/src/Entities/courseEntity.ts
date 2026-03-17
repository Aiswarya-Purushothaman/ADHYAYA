import { ObjectId } from "mongoose";

export class Course {
  count(arg0: string, count: any) {
    throw new Error("Method not implemented.");
  }
  filter(arg0: (course: any) => boolean) {
    throw new Error("Method not implemented.");
  }
  constructor(
    public readonly _id: ObjectId,
    public readonly instructorId: ObjectId,
    public readonly title: string,
    public readonly description: string,
    public readonly category: string,
    public readonly thumbnail: string,
    public readonly price: number,
    public readonly duration: number,
    public readonly rating: number,
    public readonly isApproved: string ,
    public readonly reviews: { studentId: ObjectId, comment: string }[],
    public readonly level: string,
    public readonly sections: {
      _id?:ObjectId,
      videoTitle: string,
      videoDescription: string,
      videoUrl: string
    }[]
  ) {}
}
