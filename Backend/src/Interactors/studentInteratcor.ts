import { studentInteractorInterface } from "../Interfaces/studentInterfaces/IstudentInteratctor";
import { studentRespositoryInterface } from "../Interfaces/studentInterfaces/IstudentRepository";
import { sendMail } from "../Helpers/nodemailer";
import bcrypt from "bcryptjs";
import { log } from "console";
import { generateAcessToken, generateRefreshToken } from "../utils/jwt";
import { Response } from "express";
import { ObjectId, Schema } from "mongoose";
import { Stripe } from "stripe";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Enrollments } from "../Entities/enrollmentEntity";
import mongoose, { Types } from "mongoose";
import { sendRandomMail } from "../Helpers/RandomPassword";
import { Instructor } from "../Entities/instructorEntity";
import { Review } from "../Entities/reviewEntity";
import { Chat } from "../Entities/chatEntity";

dotenv.config();

export class studentInteractor implements studentInteractorInterface {
  private repository: studentRespositoryInterface;
  constructor(repository: studentRespositoryInterface) {
    this.repository = repository;
  }

  async deleteChat(data: any): Promise<Chat | any> {
    const ChatId=data.ChatId
    const chat = await this.repository.findChatDelete(ChatId);
    return chat
  
  }

  async deleteReview(data: any): Promise<Review | any> {
    const reviewId=data.reviewId
    const review = await this.repository.findReviewDelete(reviewId);
    return review
  
  }


  async FetchAllReviews(): Promise<Review | any> {
   const reviews=await this.repository.fetchAllReview()
   return reviews
  }


  async SubmitcourseReview(id: ObjectId, data: any): Promise<Review | any> {
  const user=await this.repository.findById(id)
  if(user){
    const review=await this.repository.CreateReview(id,data)
    if(review){
      const user=await this.repository.updateById(id,{$push:{reviews:data.courseId}})
      return user
    }
  }
  }



  async fetchMessages(userId: ObjectId, receiverId: ObjectId) {
    const messages = await this.repository.fetchRoom(userId, receiverId);
    console.log('messages fronm database',messages)
    if(messages.length){
      const groupedData = messages.reduce((acc:any,message:any)=>{
        const sender = message?.sender?._id
        const receiver = message?.receiver?._id
          acc.push({
            _id:message._id,
            message:message.message,
            sender:sender===userId.toString(),
            time:message.Time,
            type:message.type
          })
        return acc
      },[])
      console.log('gtorupedData',groupedData,'groupedDataaaaa')
     return groupedData
    }
  }

  async FetchMyInstructor(id: ObjectId) {
    const enrolls = await this.repository.fetchEnrolled(id);
    const InstructorIds:any = []
    if (enrolls) {
      const allInstructorPromises = enrolls.map(async (enroll) => {
        if (enroll.Courses) {
          const courseIds = enroll.Courses.map((course) => course.courseId);
          const uniqueInstructorIds:Set<string> = new Set()
         
          courseIds.forEach((course:any)=>{
            const InstructorId = course.instructorId
            if(!uniqueInstructorIds.has(InstructorId)){
              uniqueInstructorIds.add(InstructorId)
               InstructorIds.push(InstructorId)
            }
          })
        }
      });
      // const instructors = await Promise.all(allInstructorPromises);
      // console.log(instructors,"instructors");
    
    }
    const instructor = await this.repository.findMyinst(InstructorIds);
    console.log(instructor,'thisis instructor')
    return instructor;
  }

  async sectionProgress(data: any, userId: Schema.Types.ObjectId) {
    const sectionId = data.sectionId;
    const progress = data.progress;
    const courseId = data.courseId;

    let Enrollment: any;
    const enrollments = await this.repository.fetchEnrolled(userId);
    const update = enrollments?.map((enrollment) => {
      enrollment.Courses.map((course: any) => {
       
        if (course.courseId._id.toString() === courseId) {
          Enrollment = enrollment;
        }
      });
    });
   
    if (Enrollment) {

      const course = Enrollment.Courses.find((c: any) => c.courseId._id.toString() === courseId);

      if (course && course.progress < progress) {
          console.log(Enrollment, "less");
          const update = await this.repository.updateModuleProgress(
              Enrollment._id,
              courseId,
              sectionId,
              progress
          )
          return update;
      } else {
          console.log("No update needed, progress is not greater than current progress.");
      }
  }
}

  async updateEmail(userId: Schema.Types.ObjectId, email: string) {
    const user = await this.repository.updateById(userId, { email: email });
    return user;
  }
  async fetchMycourses(id: Schema.Types.ObjectId) {
    const enrollments = await this.repository.fetchEnrolled(id);


    if (enrollments) {
    

      const userCourses = enrollments.flatMap((enrollment) => {
        return enrollment.Courses.map((course) => {
        
          return course;
        });
      });

      return userCourses;
    }
  }

  async Success(id: Schema.Types.ObjectId, total: number) {
    

    const user = await this.repository.findById(id);
   
    if (user.cart.length) {
      const enrolled = await Promise.all(
        user.cart.map(async (course: any) => {
          const courseId = course.courseId as {
            sections: any;
            _id: ObjectId;
          };
         

          return {
            courseId: courseId._id,
            progress: 0,
            isCompleted: false,
            Sections: courseId.sections.map((section: any) => {
             
              return {
                sectionId: section._id,
                progress: 0,
                isCompleted: false,
              };
            }),
          };
        })
      );
      const data = { studentId: id, Courses: enrolled, Total: total };
      const enrollment = await this.repository.Enroll(data);
     

      const courseIds = user.cart.map((course) => {
        return course.courseId;
      });
      const users = await this.repository.updateById(id, {
        $push: { enrollments: courseIds },
      });
    }
    const cart = await this.repository.updateById(id, { cart: [] });
    return cart;
  }

  async RefreshToken(refreshtoken: string, res: Response) {
    const identity = "Student";
    console.log(identity, "helloooooooo");
    const decoded = jwt.verify(
      refreshtoken,
      process.env.JWT_Refresh_SecretKey as string
    );
    console.log(decoded, "decoded");
    let userId;
    if (decoded && typeof decoded !== "string" && "userId" in decoded) {
      userId = decoded.userId;
    }
    const user = await this.repository.findById(userId);
    console.log(user, "user");

    if (user) {
      generateAcessToken(res, user._id.toString(), identity);
      generateRefreshToken(res, user._id.toString(), identity);
      return user;
    } else {
      
      throw new Error("No refreshToken");
    }
  }

  async checkOut(courses: any, Total: any) {
   

    const lineItems = courses.map((course: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: course.title,
          images: [course.thumbnail],
        },
        unit_amount: Math.round(course.price) * 100,
      },
      quantity: 1,
    }));
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failed",
    });
   

    return session;
  }

  async unCart(data: any) {
    const user = await this.repository.updateById(data.user._id, {
      $pull: { cart: { courseId: data.id } },
    });
   
    return user;
  }
  async removeSaved(data: any) {
    const user = await this.repository.updateById(data.user._id, {
      $pull: { saved: { courseId: data.id } },
    });
    return user;
  }

  async fetchCart(id: Schema.Types.ObjectId) {
    const user = await this.repository.findById(id);
  
    if (user && user.cart.length > 0) {
      const courseIds = user.cart.map((item) => item.courseId);
      const items = await this.repository.findCartCourse(courseIds);
    
      return items;
    }
  }

  async addCart(data: any) {
    const user = await this.repository.findById(data.user._id);

    if (user.cart) {
      const courseExists = user.cart.find((item) => {
        const Id = item.courseId.toString();
        return Id === data.id;
      });
    
      if (!courseExists) {
        const cart = await this.repository.updateById(data.user._id, {
          $addToSet: { cart: { courseId: data.id } },
        });
       
        return cart;
      } else {
        throw new Error("Item already exists");
      }
    }
  }
  async addSaved(data: any) {
    const user = await this.repository.findById(data.user._id);

    if (user.saved) {
      const courseExists = user.saved.find((item) => {
        const Id = item.courseId.toString();
        return Id === data.id;
      });
     
      if (!courseExists) {
        const saved = await this.repository.updateById(data.user._id, {
          $addToSet: { saved: { courseId: data.id } },
        });
      
        return saved;
      } else {
        throw new Error("Item already exists");
      }
    }
  }

  async fetchCourse(): Promise<any> {
    const course = await this.repository.fetchCourseUser();
    return course;
  }

  async checkUser(data: any) {
    const user = await this.repository.findById(data.id);
    return user;
  }

  async changePassword(data: any, userId: ObjectId) {
    const user = await this.repository.findById(userId);
   
    if (user) {
      const match = await bcrypt.compare(data.currentPass, user.password);
     
      if (match) {
        const newpass = data.newPass;
       

        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(newpass, salt);
        console.log(encrypted, "encrypted");

        const user = await this.repository.updateById(userId, {
          password: encrypted,
        });
        return user;
      } else {
        throw new Error("wrong password");
      }
    }
  }
  async updateUser(data: any, userId: ObjectId) {
    const user = await this.repository.updateById(userId, {
      name: data.name,
      email: data.email,
      contact: data.contact,
    });
   
    return user;
  }

  async updatePassword(data: any) {
    const user = await this.repository.findUser(data.email);
    const userId = user._id;
    if (user) {
      const newpass = data.newpass;

      console.log(newpass, "hey user here");

      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(newpass, salt);
      console.log(encrypted, "encrypted");

      const user = await this.repository.updateById(userId, {
        password: encrypted,
      });

      return user;
    } else {
      throw new Error("no user");
    }
  }

  async sendOtp(email: string) {
    const user = await this.repository.findUser(email);
    if (!user) {
      const otp = await sendMail(email);
      return otp;
    } else {
      throw new Error("user exists");
    }
  }

  async forgotOtp(email: string) {
   
    const user = await this.repository.findUser(email);
   
    if (user) {
      const otp = await sendMail(email);
      return otp;
    } else {
      throw new Error("invalid email");
    }
  }

  async createUser(data: any) {
   
    const user = await this.repository.findUser(data.email);
    
    const contact = await this.repository.findUser(data.contact);
    if (user || contact) {
      throw new Error("user already exists");
    } else if (data.googleUserId) {
  
      const user = await this.repository.registerGoogleUser(data);
     
      if (user) {
        const generateRandom = await sendRandomMail(data.email);
        console.log(generateRandom, "generateRandomgenerateRandom");

        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(generateRandom, salt);
     

        const googleuser = await this.repository.updateById(user._id, {
          password: encrypted,
        });

        return googleuser;
      }
    } else {
      const user = await this.repository.userRegister(data);
     
      return user;
    }
  }

  async loginUser(data: any, res: Response) {
    const identity = "Student";
   
    const user = await this.repository.userExist(data.email);

    if (user && user.isBlocked === false) {
      if (user.googleUserId && user.googleUserId === data.googleUserId) {

        let match = false;
        if (data.password) {
          const enteredpass = data.password;
          const originalpass = user.password;
          match = await bcrypt.compare(enteredpass, originalpass);
          generateAcessToken(res, user._id.toString(), identity);
          generateRefreshToken(res, user._id.toString(), identity);
          return user;
        } else {
          // (user.googleUserId === data.googleUserId)
          generateAcessToken(res, user._id.toString(), identity);
          generateRefreshToken(res, user._id.toString(), identity);
          return user;
        }
      } else {
        const enteredpass = data.password;
        const originalpass = user.password;
        const match = await bcrypt.compare(enteredpass, originalpass);
        if (match) {
          generateAcessToken(res, user._id.toString(), identity);
          generateRefreshToken(res, user._id.toString(), identity);
          return user;
        } else {
          throw new Error("wrong password");
        }
      }
    } else {
      throw new Error("user not found ");
    }
  }

  async uploadImageStudent(userId: ObjectId, data: any) {
    const user = await this.repository.findById(userId);
    if (user) {
      const user = await this.repository.updateById(userId, {
        profileImage: data,
      });
      return user;
    }
  }
}
