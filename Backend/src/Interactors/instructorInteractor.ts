import { instructorInteractorInterface } from "../Interfaces/instructorInteface/IinstInteractor";
import { instructorRepositoryInterface } from "../Interfaces/instructorInteface/IinstRepository";
import { sendMail } from "../Helpers/nodemailer";
import bcrypt from "bcryptjs";
import { generateAcessToken, generateRefreshToken } from "../utils/jwt";
import { Response } from "express";
import { ObjectId, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { sendRandomMail } from "../Helpers/RandomPassword";
import { User } from "../Entities/userEntity";
import { Chat } from "../Entities/chatEntity";
import { Review } from "../Entities/reviewEntity";

export class instructorInteractor implements instructorInteractorInterface {
  private repository: instructorRepositoryInterface;
  constructor(repository: instructorRepositoryInterface) {
    this.repository = repository;
  }

  async deleteChat(data: any): Promise<Chat | any> {
    const ChatId=data.ChatId
    const chat = await this.repository.findChatDelete(ChatId);
    return chat
  
  }
  async onFetchAllReviews(): Promise<Review | any> {
    const reviews=await this.repository.fetchAllReviews()
    return reviews
   }
 
  async ReviewReply(reviewId: string, reply: string) {
    const review = await this.repository.findReview(reviewId);
    if (review && !review.reply) {
      const update = await this.repository.updateReview(reviewId, {
        reply: reply,
      });
      return update;
    } else {
      throw new Error("Already reply exits");
    }
  }

  async fetchMessages(userId: ObjectId, receiverId: ObjectId) {
    const messages = await this.repository.fetchRoom(userId, receiverId);
    if (messages.length) {
      const groupedData = messages.reduce((acc: any, message: any) => {
        const sender = message?.sender?._id;
        const receiver = message?.receiver?._id;
        console.log(userId, sender);
        acc.push({
          _id:message._id,
          message: message.message,
          sender: sender === userId.toString(),
          time: message.Time,
          type: message.type,
        });
        return acc;
      }, []);
      console.log("gtorupedData", groupedData, "groupedDataaaaa");
      return groupedData;
    }
  }

  async FetchMyEnroll(id: ObjectId) {
    const instructor = await this.repository.findById(id);
    if (instructor) {
      let courseIds: any = [];
      instructor.courses.map((course) => {
        courseIds.push(course.courseId);
      });
      console.log(courseIds);
      const enrolls = await this.repository.EnrollPrice(courseIds);

      const coursePrices = new Map<string, number>();
      enrolls.forEach((enroll) => {
        coursePrices.set(enroll._id.toString(), enroll.price);
      });
      console.log(coursePrices);
      const data = await this.repository.fetchEnrollments(courseIds);
      console.log(data);
      const enrollments = new Map<string, number>();
      data.forEach((enrollment) => {
        enrollments.set(enrollment?._id.toString(), enrollment.count);
      });
      let totalIncome = 0;
      courseIds.forEach((courseId: any) => {
        const courseIdStr = courseId.toString();
        const price = coursePrices.get(courseIdStr) || 0;
        const enrollmentCount = enrollments.get(courseIdStr) || 0;
        totalIncome += price * enrollmentCount;
      });
      console.log(totalIncome);
      return totalIncome;
    }
  }

  async FetchMyStudentes(id: ObjectId) {
    const instructor = await this.repository.findById(id);

    if (instructor) {
      let courseIds: any = [];
      instructor.courses.map((course) => {
        courseIds.push(course.courseId);
      });
      const students = await this.repository.matchStudents(courseIds);
      return students;
    }
  }

  async UpdateCourse(data: any): Promise<any> {
    const course = await this.repository.updateCourseById(data.id, {
      title: data.title,
      description: data.description,
      category: data.category,
      thumbnail: data.thumbnail,
      price: data.price,
      duration: data.duration,
      isApproved: "pending",
      level: data.level,
      sections: data.sections,
    });
    return course;
  }

  async updateEmail(userId: Schema.Types.ObjectId, email: string) {
    const user = await this.repository.updateById(userId, { email: email });
    return user;
  }

  async RefreshToken(refreshtoken: string, res: Response) {
    const identity = "Instructor";

    const decoded = jwt.verify(
      refreshtoken,
      process.env.JWT_Refresh_SecretKey as string
    );
    let userId;
    if (decoded && typeof decoded !== "string" && "userId" in decoded) {
      userId = decoded.userId;
    }
    const user = await this.repository.findById(userId);
    if (user) {
      generateAcessToken(res, user._id.toString(), identity);
      generateRefreshToken(res, user._id.toString(), identity);
      return user;
    } else {
      throw new Error("No refreshToken");
    }
  }

  async Mycourse(instructorId: ObjectId) {
    const instructor = await this.repository.findById(instructorId);
    if (instructor) {
      const AllCourses = await this.repository.fetchCourses();
      const instructorCourses = AllCourses.filter(
        (course) => course.instructorId.toString() === instructorId.toString()
      );
      return instructorCourses;
    }
  }

  async AddCourse(data: any, instructorId: ObjectId) {
    const instructor = await this.repository.findById(instructorId);
    if (instructor) {
      const course = await this.repository.CreateCourse(data, instructorId);
      if (course) {
        const instructor = await this.repository.updateById(instructorId, {
          $addToSet: { courses: { courseId: course._id } },
        });

        return instructor;
      }
    }
  }
  async checkInstructor(data: any) {
    const instructor = await this.repository.findById(data.id);
    return instructor;
  }

  async UploadImageInst(data: any, InstructorId: ObjectId) {
    const instructor = await this.repository.updateById(InstructorId, {
      profileImage: data.profileImage,
    });
    return instructor;
  }

  async updateInstructor(data: any, instructorId: ObjectId) {
    const instructor = await this.repository.updateById(instructorId, {
      name: data.name,
      email: data.email,
      contact: data.contact,
      description: data.description,
    });

    return instructor;
  }

  async changePassword(data: any, instructorId: ObjectId) {
    const instructor = await this.repository.findById(instructorId);

    if (instructor) {
      const match = await bcrypt.compare(data.currentPass, instructor.password);

      if (match) {
        const newpass = data.newPass;

        console.log(newpass, "hey instructor here");

        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(newpass, salt);
        console.log(encrypted, "encrypted");

        const instructor = await this.repository.updateById(instructorId, {
          password: encrypted,
        });
        return instructor;
      } else {
        throw new Error("wrong password");
      }
    }
  }

  async updatePassword(data: any) {
    const instructor = await this.repository.findInstructor(data.email);
    const userId = instructor._id;
    if (instructor) {
      const newpass = data.newpass;

      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(newpass, salt);
      console.log(encrypted, "encrypted");
      const instructor = await this.repository.updateById(userId, {
        password: encrypted,
      });
      return instructor;
    } else {
      throw new Error("no user");
    }
  }

  async forgotOtpInst(email: string) {
    const instructor = await this.repository.findInstructor(email);

    if (instructor) {
      const otp = await sendMail(email);
      return otp;
    } else {
      throw new Error("invalid email");
    }
  }

  async SendOtp(email: string) {
    const instructor = await this.repository.findInstructor(email);
    if (!instructor) {
      const otp = await sendMail(email);
      console.log(otp, "otp in interactor");
      return otp;
    } else {
      throw new Error("instructor already exist");
    }
  }
  async CreateInstructor(data: any) {
    const instructor = await this.repository.findInstructor(data.email);
    const contact = await this.repository.findInstructor(data.contact);
    if (instructor || contact) {
      throw new Error("instructor already exist");
    } else if (data.googleUserId) {
      const instructor = await this.repository.googleInstRegister(data);
      if (instructor) {
        const generateRandom = await sendRandomMail(data.email);
        console.log(generateRandom, "generateRandomgenerateRandom");

        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(generateRandom, salt);
        console.log(encrypted, "encrypted");

        const googleuser = await this.repository.updateById(instructor._id, {
          password: encrypted,
        });

        return googleuser;
      }
    } else {
      const instructor = await this.repository.instructorRegister(data);

      return instructor;
    }
  }

  async loginInstructor(data: any, res: Response) {
    const identity = "Instructor";
    const instructor = await this.repository.instructorExist(data.email);
    if (instructor && instructor.isBlocked === false) {
      if (
        instructor.googleUserId &&
        instructor.googleUserId === data.googleUserId
      ) {
        let match = false;
        if (data.password) {
          const enteredpass = data.password;
          const originalpass = instructor.password;
          match = await bcrypt.compare(enteredpass, originalpass);
          generateAcessToken(res, instructor._id.toString(), identity);
          generateRefreshToken(res, instructor._id.toString(), identity);
          return instructor;
        } else {
          // (instructor.googleUserId===data.googleUserId)
          generateAcessToken(res, instructor._id.toString(), identity);
          generateRefreshToken(res, instructor._id.toString(), identity);
          return instructor;
        }
      } else {
        const enteredPass = data.password;
        const originalpass = instructor.password;
        const match = await bcrypt.compare(enteredPass, originalpass);
        if (match) {
          generateAcessToken(res, instructor._id.toString(), identity);
          generateRefreshToken(res, instructor._id.toString(), identity);
          return instructor;
        } else {
          throw new Error("wrong password");
        }
      }
    } else {
      throw new Error("user not found");
    }
  }
}
