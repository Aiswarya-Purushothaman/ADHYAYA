import { NextFunction, Response, Request } from "express";
import { studentInteractorInterface } from "../Interfaces/studentInterfaces/IstudentInteratctor";
import { log } from "console";

export class studentController {
  private interactor: studentInteractorInterface;
  constructor(interactor: studentInteractorInterface) {
    this.interactor = interactor;
  }

  async onDeleteUserChat(req: Request, res: Response, next: NextFunction) {
    try {
      const data=req.body
      const chat = await this.interactor.deleteChat(data);
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  
  async onDeleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data=req.body
      const review = await this.interactor.deleteReview(data);
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  
  async onFetchAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await this.interactor.FetchAllReviews();
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json(error);
    }
  }


  async onSubmitcourseReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const data = req.body;
      const review = await this.interactor.SubmitcourseReview(userId, data);
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async onfetchMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const receiverId = req.body.receiverId;
      console.log(userId, receiverId);
      const messages = await this.interactor.fetchMessages(userId, receiverId);
      console.log(messages, "messagesccccsss");
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onFetchMyInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const instructors = await this.interactor.FetchMyInstructor(userId);
      console.log(instructors,"instructorsinstructors");
      res.status(200).json(instructors);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onSectionProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.body.user._id;

      const progress = await this.interactor.sectionProgress(data, userId);
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onUpdateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const email = req.body.email;
      const user = await this.interactor.updateEmail(userId, email);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onFetchMyCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const enrolled = await this.interactor.fetchMycourses(userId);
      res.status(200).json(enrolled);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const total = req.body.Total;

      const user = await this.interactor.Success(userId, total);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshtoken = req.cookies.StudentRefreshToken;

      if (!refreshtoken) {
        return res.status(409).json({ message: "No refreshToken" });
      }
      const data = await this.interactor.RefreshToken(refreshtoken, res);

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = req.body.data.products;
      const Total = req.body.data.Total;

      const data = await this.interactor.checkOut(courses, Total);

      const id = data.id;
      res.status(200).json(id);
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }

  async onUnCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const data = req.body;

      const user = await this.interactor.unCart(data);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onRemovedSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const user = await this.interactor.removeSaved(data);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onFetchCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body.user._id;
      const items = await this.interactor.fetchCart(user);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onAddCart(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = req.body.user._id;

      const cart = await this.interactor.addCart(data);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json(error.meassage);
    }
  }
  async onAddSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const user = req.body.user._id;

      const cart = await this.interactor.addSaved(data);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json(error.meassage);
    }
  }

  async onFetchCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await this.interactor.fetchCourse();

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onCheckUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const user = await this.interactor.checkUser(data);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      const user = await this.interactor.createUser(body);

      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "user already exists") {
        res.status(409).json(error.message);
      } else {
        res.status(500).json(error.meassage);
      }
    }
  }

  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      const user = await this.interactor.loginUser(body, res);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "wrong password") {
        res.status(401).json(error.message);
      } else if (error.message === "user not found") {
        res.status(409).json(error.message);
      } else {
        res.status(500).json(error.meassage);
      }
    }
  }

  async onSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const otp = await this.interactor.sendOtp(email);
      console.log(otp);

      res.status(200).json(otp);
    } catch (error: any) {
      if (error) {
        res.status(409).json(error);
      }
    }
  }

  async onForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const otp = await this.interactor.forgotOtp(email);
      res.status(200).json(otp);
    } catch (error: any) {
      if (error) {
        res.status(409).json(error.message);
      }
    }
  }
  async onUpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.interactor.updatePassword(req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(409).json(error.message);
    }
  }

  async onUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.body.user._id;

      const user = await this.interactor.updateUser(data, userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  }

  async onChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.body.user._id;
      const user = await this.interactor.changePassword(data, userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(409).json(error.message);
    }
  }
  async onUploadImageStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id;
      const data = req.body.profileImage;

      const user = await this.interactor.uploadImageStudent(userId, data);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
