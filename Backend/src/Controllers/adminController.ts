import { log } from "console";
import { adminInteractorInteface } from "../Interfaces/adminInterface/IadminInteractor";
import { Request, Response, NextFunction } from "express";

export class admincontroller {
  private interactor: adminInteractorInteface;
  constructor(interactor: adminInteractorInteface) {
    this.interactor = interactor;
  }

  async onRefreshToken(req:Request,res:Response,next:NextFunction){
    try {
      const refreshtoken=req.cookies.InstructorRefreshToken
      if(!refreshtoken){
        console.log('not wroking')
       return res.status(409).json({message:"No refreshToken"})
      }
      const data=await this.interactor.RefreshToken(refreshtoken,res)
      res.status(201).json(data)
    } catch (error) {
      res.status(500).json(error)
    }
   
         }
   
   


async onFetchInstructor(req:Request,res:Response,next:NextFunction){
try {
  console.log(req.body,"ooooooooo");
  const instructor=await this.interactor.fetchInstructor(req.body)
  res.status(200).json(instructor)
} catch (error) {
  res.status(500).json(error)
}
}

async onRejectCourse(req:Request,res:Response,next:NextFunction){
  try {
    console.log(req.body.id,"djbfjbs");
    const data=req.body
    const course=await this.interactor.RejectCourse(data)
    res.status(200).json(course)
  } catch (error) {
    res.status(500).json(error)
  }
}


  async onApproveCourses(req: Request, res: Response, next: NextFunction){
try {
  console.log(req.body.id,"djbfjbs");
  const data=req.body
  const course=await this.interactor.approveCourse(data)
  res.status(200).json(course)
} catch (error) {
  res.status(500).json(error)
}
  }

async onfetchAllcourses(req: Request, res: Response, next: NextFunction){
try {
  const courses=await this.interactor.fetchAllcourses()
  res.status(200).json(courses)
} catch (error) {
  res.status(500).json(error)
}
}

  async onUpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const admin = await this.interactor.updatePassword(data);
      res.status(200).json(admin);
    } catch (error: any) {
      res.status(409).json(error.message);
    }
  }

  async onLoginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const admin = await this.interactor.loginAdmin(data,res);
      res.status(200).json(admin);
    } catch (error: any) {
      if (
        error.message === "wrong password" ||
        error.message === "Admin doesnt exist"
      ) {
        res.status(409).json(error.message);
      } else {
        res.status(500).json(error.message);
      }
    }
  }

  async onforgotAdminotp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const otp = await this.interactor.forgotAdminotp(email);
      res.status(200).json(otp);
    } catch (error: any) {
      res.status(409).json(error.message);
    }
  }


  async onFetchStudents(req: Request, res: Response, next: NextFunction){
    try {
      const students=await this.interactor.fetchStudents()
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json(error)
    }


  }
  async onFetchInstructors(req: Request, res: Response, next: NextFunction){
    try {
      const instructors=await this.interactor.fetchInstructors()
      res.status(200).json(instructors)
    } catch (error) {
      res.status(500).json(error)
    }


  }
  async onChangeStatus(req:Request,res:Response,next:NextFunction){
    try {
      console.log(req.body,"hey its the block");
      const data=req.body
      const status=await this.interactor.changeStatusUser(data)
      console.log(status,'statusssss chhategeeeee')
      res.status(200).json(status)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  async onChangeStatusInstructor(req:Request,res:Response,next:NextFunction){
    try {
      console.log(req.body,"hey its the block");
      const data=req.body
      const status=await this.interactor.changeStatusInstructor(data)
      console.log(status,"status in controllerss");
      
      res.status(200).json(status)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}



