import { studentRespositoryInterface } from "../Interfaces/studentInterfaces/IstudentRepository";
import UserSchema from "../db/models/studentSchema";
import { User } from "../Entities/userEntity";
import { ObjectId, Schema } from "mongoose";
import { Course } from "../Entities/courseEntity";
import CourseSchema from "../db/models/courseSchema";
import { Enrollments } from "../Entities/enrollmentEntity";
import EnrollmentSchema from "../db/models/EnrollmentSchema"
import { AnyARecord } from "dns";
import { log } from "console";
import { Instructor } from "../Entities/instructorEntity";
import InstructorSChema from "../db/models/instructorSchema"
import { Chat } from "../Entities/chatEntity";
import ChatSchema from "../db/models/ChatSchema"
import { Review } from "../Entities/reviewEntity";
import ReviewSchema from "../db/models/review";

export class studentRepository implements studentRespositoryInterface {
  private userDB: typeof UserSchema;
  private InstructorDB: typeof InstructorSChema;
  private courseDB:typeof CourseSchema
  private EnrollmentDB:typeof EnrollmentSchema
  private chatDB:typeof ChatSchema
  private ReviewDB:typeof ReviewSchema
  constructor() {
    this.userDB = UserSchema;
    this.courseDB=CourseSchema
    this.EnrollmentDB=EnrollmentSchema
    this.InstructorDB=InstructorSChema
    this.chatDB = ChatSchema;
    this.ReviewDB = ReviewSchema;
  }

  async findChatDelete(ChatId: string) {
    const chat = await this.chatDB.findByIdAndDelete({ _id:ChatId });
    if(chat){
      console.log("7777");
    }
 
    
    return chat;
  }

  async findReviewDelete(reviewId: string) {
    const review = await this.ReviewDB.findByIdAndDelete({ _id:reviewId });
    return review;
  }

  async fetchAllReview(): Promise<Review|any> {
    const review = await this.ReviewDB.find().populate('studentId').populate('courseId');
    console.log(review,"0009");
   return review
   
  }
 async CreateReview(userId: ObjectId, data: any): Promise<Review | any> {
    const review=await this.ReviewDB.create({
      studentId:userId,
      courseId:data.courseId,
      comment:data.comment,
      rating:data.rating
    })
    // console.log(review,"reviewreviewrepo");
    
    return review
  }

  async fetchRoom(userId: ObjectId, receiverId: ObjectId): Promise<Chat[] | any> {
    const message=await this.chatDB.find({
      $or:[
        {$and:[{"sender._id":userId.toString()},{"receiver._id":receiverId.toString()}]},
        {$and:[{"sender._id":receiverId.toString()},{"receiver._id":userId.toString()}]}
      ]
    })
  
    return message
    }
  
  async findMyinst(instructorId: any[]): Promise<Instructor[]|any> {
    const instructors=await this.InstructorDB.find({_id:{$in:instructorId}})
    // console.log(instructors,"instructors");
    return instructors
  }

async updateModuleProgress(enrollmentId: string, courseId: ObjectId, sectionId: string, progress: number): Promise<Enrollments | null|any> {
 
  
  const updateResult = await this.EnrollmentDB.findOneAndUpdate(
    { _id: enrollmentId, 'Courses.courseId': courseId },
    {
        $set: {
            'Courses.$[course].Sections.$[section].progress': progress
        }
    },
    {
        arrayFilters: [
            { 'course.courseId': courseId },
            { 'section.sectionId': sectionId }
        ],
        new: true
    }
);

if (!updateResult) {
    throw new Error('Enrollment not found or update failed');
}

const findEnrollment: any = await this.EnrollmentDB.findOne({ _id: enrollmentId });
const enrolledCourse = findEnrollment.Courses.find((course: any) => course.courseId.toString() === courseId.toString());

const averageProgress = enrolledCourse.Sections.reduce((acc: number, section: any) => acc + section.progress, 0) / enrolledCourse.Sections.length;

const allModulesAbove90 = enrolledCourse.Sections.every((section: any) => section.progress >= 90);

let update;
if (allModulesAbove90) {
    update = await this.EnrollmentDB.findOneAndUpdate(
        { _id: enrollmentId, 'Courses.courseId': courseId },
        {
            $set: {
                'Courses.$[course].progress': 100,
                'Courses.$[course].isCompleted': true
            }
        },
        {
            arrayFilters: [{ 'course.courseId': courseId }],
            new: true
        }
    );
} else {
    update = await this.EnrollmentDB.findOneAndUpdate(
        { _id: enrollmentId, 'Courses.courseId': courseId },
        {
            $set: {
                'Courses.$[course].progress': averageProgress,
                'Courses.$[course].isCompleted': false,
            }
        },
        {
            arrayFilters: [{ 'course.courseId': courseId }],
            new: true
        }
    );
}
// return update;
    }
  



  async fetchEnrolled(id: Schema.Types.ObjectId): Promise<Enrollments|any> {
  const enrolled:any=await this.EnrollmentDB.find({studentId:id}).populate('Courses.courseId')
  console.log(enrolled[0].Courses[0].courseId)
  return enrolled
  }


  async Enroll(data: any): Promise<Enrollments|any> {
    const enrollment=await this.EnrollmentDB.create(data)
    return 
  }
  async findCartCourse(ids: Schema.Types.ObjectId[]): Promise<Course|any> {
    const items = await this.courseDB.find({ _id: { $in: ids } });
    return items;
    
  }

  async fetchCourseUser(): Promise<Course|any> {
    const course=await this.courseDB.find()
    return course
  }

  async registerGoogleUser(data: any): Promise<User|any> {
    const newUser = await this.userDB.create({
      name: data.name,
      email: data.email,
      profileImage: data.profileImage,
      googleUserId: data.googleUserId,
    });
    return newUser;
  }


 async findById(id: ObjectId): Promise<User|any> {
    const user=await this.userDB.findById(id).populate('cart.courseId')
    return user
  }
  

  async updateById(id: ObjectId, data: any): Promise<User | any> {
    const user = await this.userDB.findByIdAndUpdate(id, data, { new: true }).populate('cart.courseId').populate('saved.courseId')
    return user;
  }

  async userRegister(data: any): Promise<User | any> {
    const newUser = await this.userDB.create({
      name: data.name,
      email: data.email,
      contact: data.contact,
      password: data.password,
    });
    return newUser;
  }

  async findUser(email: string): Promise<User | any> {
    const user = await this.userDB.findOne({ email });
    console.log(user);
    return user;
  }

  async userExist(email: string): Promise<User | any> {
    console.log("its the userExits in repo");
    const user = await this.userDB.findOne({ email });
    console.log(user, "user present");
    return user;
  }
}
