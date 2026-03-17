import { Request, Response, NextFunction } from "express";
import { instructorInteractorInterface } from "../Interfaces/instructorInteface/IinstInteractor";

export class instructorController {
  private interactor: instructorInteractorInterface;
  constructor(interactor: instructorInteractorInterface) {
    this.interactor = interactor;
  }
  async onDeleteInstructorChat(req: Request, res: Response, next: NextFunction) {
    try {
      const data=req.body
      console.log(data,"datadlt");
      
      const chat = await this.interactor.deleteChat(data);
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async onReviewReply(req: Request, res: Response, next: NextFunction){
    try {
      const reviewId=req.body.reviewId
      const reply=req.body.reply
      const review =await this.interactor.ReviewReply(reviewId,reply)
      res.status(200).json(review)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
  
  async onFetchAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await this.interactor.onFetchAllReviews();
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json(error);
    }
  }




  async onfetchMessages(req: Request, res: Response, next: NextFunction){
    try {
      const userId = req.body.user._id;
      const receiverId=req.body.receiverId            
      const messages=await this.interactor.fetchMessages(userId,receiverId)
      console.log(messages,"messagescccc");
      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json(error)
    }
  }



  async onFetchMyEnroll(req: Request, res: Response, next: NextFunction){
    try {
      console.log('ftech ny ernoollllll')
      const userId = req.body.user._id;
      const Total=await this.interactor.FetchMyEnroll(userId)
      res.status(200).json(Total)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async onFetchMyStudents(req: Request, res: Response, next: NextFunction){
    try {
      const userId = req.body.user._id;
      const students=await this.interactor.FetchMyStudentes(userId)
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json(error)
    }
  }


  async onUpdateCourse(req: Request, res: Response, next: NextFunction){
    try {
      const data=req.body
     
      const course=await this.interactor.UpdateCourse(data)
     
      res.status(200).json(course)
    } catch (error) {
      res.status(500).json(error)
    }
  }



  async onUpdateEmail(req: Request, res: Response, next: NextFunction){
    try {
      const userId = req.body.user._id;
      const email=req.body.email
      const user=await this.interactor.updateEmail(userId,email)
     
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
      }

  async onRefreshToken(req:Request,res:Response,next:NextFunction){
    try {
      let refreshtoken=req.cookies.InstructorRefreshToken
      // refreshtoken = null
      if(!refreshtoken){
       
       return res.status(409).json({message:"No refreshToken"})
      }
      const data=await this.interactor.RefreshToken(refreshtoken,res)
      res.status(201).json(data)
    } catch (error){
      res.status(500).json(error)
    }

      }


  async onMyCourse(req: Request, res: Response, next: NextFunction){
    try {
      const instructorId=req.body.user._id
    
      const instructor=await this.interactor.Mycourse(instructorId)
      res.status(200).json(instructor)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async OnChekcInstructor(req: Request, res: Response, next: NextFunction){
try {
  const data=req.body
  const instructor=await this.interactor.checkInstructor(data)
  res.status(200).json(instructor)
} catch (error) {
  res.status(500).json(error)
} }



  async onForgotOtpInst(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const otp = await this.interactor.forgotOtpInst(email);
      console.log(otp, "otp in controller");

      res.status(200).json(otp);
    } catch (error: any) {
      if (error) {
        res.status(409).json(error.message);
      }
    }
  }

  async onUpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
    
      const instructor = await this.interactor.updatePassword(req.body);
      res.status(200).json(instructor);
    } catch (error: any) {


      res.status(409).json(error.message);
    }
  }

  async onSendotp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const otp = await this.interactor.SendOtp(email);
  
      res.status(200).json(otp);
    } catch (error: any) {
      if (error) {
    
        
        res.status(409).json(error);
      }
    }
  }
  async onCreateInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const instructor = await this.interactor.CreateInstructor(data);
     
      
      res.status(200).json(instructor);
    } catch (error: any) {
      if (error.message === "instructor already exist") {
        res.status(409).json(error.message);
      } else {
        res.status(500).json(error.meassage);
      }
    }
  }

  async onLoginInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const instructor = await this.interactor.loginInstructor(data,res);
     
      res.status(200).json(instructor);
    } catch (error: any) {
      if (error.meassage === "wrong password") {
        res.status(409).json(error.message);
      } else {
        res.status(500).json(error.meassage);
      }
    }
  }
  
  async onUpdate(req: Request, res: Response, next: NextFunction){
    try {
 
      const data=req.body
      const instructorId=req.body.user._id
      const instructor=await this.interactor.updateInstructor(data,instructorId)
      res.status(200).json(instructor)
    } catch (error:any) {
      res.status(500).json(error.message)
    }
   
  }

  async onChangePassword(req: Request, res: Response, next: NextFunction){
    try {
   
      const data=req.body
      const instructorId=req.body.user._id
      const instructor=await this.interactor.changePassword(data,instructorId)
  
      
     res.status(200).json(instructor)
    } catch (error:any) {
   
      res.status(409).json(error.message)
    }
  }
async onUploadImageInst(req: Request, res: Response, next: NextFunction){
  try {
    
    const data =req.body
    const instructorId=req.body.user._id
    const instructor=await this.interactor.UploadImageInst(data,instructorId)
   res.status(200).json(instructor)
  } catch (error) {
    res.status(500).json(error)
  }
}

async onAddCourse(req:Request,res:Response,next:NextFunction){
  try {
    const data =req.body
    const instructorId=req.body.user._id
   const instructor=await this.interactor. AddCourse(data,instructorId)
    res.status(200).json(instructor)
  } catch (error:any) {
    res.status(500).json(error)
  }
}




}
