import { ObjectId, Schema } from "mongoose";
import { Instructor } from "../Entities/instructorEntity";
import { instructorRepositoryInterface } from "../Interfaces/instructorInteface/IinstRepository";
import InstructorSchema from "../db/models/instructorSchema";
import { AnyCnameRecord } from "dns";
import CourseSchema from "../db/models/courseSchema";
import { Course } from "../Entities/courseEntity";
import { Enrollments } from "../Entities/enrollmentEntity";
import UserSchema from "../db/models/studentSchema";
import { User } from "../Entities/userEntity";
import { Chat } from "../Entities/chatEntity";
import ChatSchema from "../db/models/ChatSchema";
import { Review } from "../Entities/reviewEntity";
import ReviewSchema from "../db/models/review";

export class instructorRepository implements instructorRepositoryInterface {
  private instDB: typeof InstructorSchema;
  private courseDB: typeof CourseSchema;
  private userDB: typeof UserSchema;
  private chatDB: typeof ChatSchema;
  private ReviewDB: typeof ReviewSchema;
  constructor() {
    this.instDB = InstructorSchema;
    this.courseDB = CourseSchema;
    this.userDB = UserSchema;
    this.chatDB = ChatSchema;
    this.ReviewDB = ReviewSchema;
  }

  async findChatDelete(ChatId: string) {
    const chat = await this.chatDB.findByIdAndDelete({ _id:ChatId });
    return chat;
  }
  
  async fetchAllReviews(): Promise<Review|any> {
    const review = await this.ReviewDB.find().populate('studentId').populate('courseId');
    console.log(review,"0009");
   return review
   
  }
  async updateReview(reviewId: string, data: any): Promise<Review | any> {
    const newreview = await this.ReviewDB.findByIdAndUpdate(reviewId, data, {
      new: true,
    });
  }
  async findReview(reviewId: string) {
    const review = await this.ReviewDB.findOne({ _id:reviewId });
    return review;
  }

  async fetchEnrollments(
    courseIds: any[]
  ): Promise<{ _id: string; count: number }[]> {
    console.log(courseIds);
    const enrollments = await this.userDB.aggregate([
      { $match: { enrollments: { $in: courseIds } } },
      { $unwind: "$enrollments" },
      { $group: { _id: "$enrollments", count: { $sum: 1 } } },
    ]);
    console.log(enrollments);
    return enrollments;
  }

  async EnrollPrice(courseIds: any[]): Promise<Course | any> {
    const students = await this.courseDB.find({ _id: { $in: courseIds } });
    return students;
  }

  async fetchRoom(
    userId: ObjectId,
    receiverId: ObjectId
  ): Promise<Chat[] | any> {
    const message = await this.chatDB.find({
      $or: [
        {
          $and: [
            { "sender._id": userId.toString() },
            { "receiver._id": receiverId.toString() },
          ],
        },
        {
          $and: [
            { "sender._id": receiverId.toString() },
            { "receiver._id": userId.toString() },
          ],
        },
      ],
    });

    console.log(message, "message");
    return message;
  }

  async matchStudents(courseIds: any[]): Promise<User | any> {
    const students = await this.userDB.find({
      enrollments: { $in: courseIds },
    });

    return students;
  }

  async updateCourseById(id: ObjectId, data: any): Promise<Course | any> {
    const course = await this.courseDB.findByIdAndUpdate(id, data, {
      new: true,
    });
    return course;
  }
  async fetchCourses(): Promise<Course | any> {
    const courses = await this.courseDB.find();
    return courses;
  }

  async CreateCourse(data: any, instructorId: ObjectId): Promise<Course | any> {
    console.log(data, "in repo");
    const {
      courseTitle,
      description,
      courseDuration,
      coursePrice,
      courseLevel,
      categories,
      image,
      sections,
    } = data;

    const transformedSections = sections.map(
      (section: { title: any; description: any; videoURL: any }) => ({
        videoTitle: section.title,
        videoDescription: section.description,
        videoUrl: section.videoURL,
      })
    );

    const instructor = await this.courseDB.create({
      instructorId: instructorId,
      title: courseTitle,
      description: description,
      category: categories,
      thumbnail: image,
      price: coursePrice,
      duration: courseDuration,
      level: courseLevel,
      sections: transformedSections,
    });
    return instructor;
  }

  async googleInstRegister(data: any): Promise<Instructor | any> {
    const instructor = await this.instDB.create({
      name: data.name,
      email: data.email,
      profileImage: data.profileImage,
      googleUserId: data.googleUserId,
    });
    return instructor;
  }

  async findById(id: ObjectId): Promise<Instructor | any> {
    const instructor = await this.instDB.findById(id);
    return instructor;
  }

  async updateById(id: ObjectId, data: any): Promise<Instructor | any> {
    const user = await this.instDB.findByIdAndUpdate(id, data, { new: true });
    console.log(user, "in repository");
    return user;
  }

  async findInstructor(email: any): Promise<Instructor | any> {
    const instructor = this.instDB.findOne({ email });
    return instructor;
  }

  async instructorRegister(data: any): Promise<Instructor | any> {
    const instructor = this.instDB.create({
      name: data.name,
      email: data.email,
      description: data.description,
      contact: data.contact,
      password: data.password,
    });

    return instructor;
  }

  async instructorExist(email: any): Promise<Instructor | any> {
    const instructor = this.instDB.findOne({ email });
    return instructor;
  }
}
