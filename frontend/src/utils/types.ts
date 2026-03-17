import { ReactNode } from "react";
import { ObjectId } from "mongoose";

export interface ChildrenProps {
  children: ReactNode;
}

export type ErrorHandler=(
  error:string
)=>void

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  contact: number;
  password: string;
  profileImage: string;
  isBlocked: boolean;
  googleUserId: string;
}
export interface Instructor {
 
  _id: ObjectId;
  name: string;
  email: string;
  description: string;
  contact: number;
  password: string;
  profileImage: string;
  isBlocked: boolean;
  googleUserId: string;
}

export interface googleRegister {
  aud: string;
  azp: string
  email:string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti:string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}
 export interface Reviews {
  _id: string;
  comment: string;
  courseId: Course;
  date: string;
  rating: number;
  studentId: User;
  reply:string
}

export  interface Course{

 _id: ObjectId,
  instructorId: ObjectId,
 title: string,
 description: string,
 category: string,
 thumbnail: string,
 price: number,
 duration: number,
 rating: number,
 
 isApproved: string,
 reviews: { studentId: ObjectId, comment: string }[],
 level: string,
 sections: {
    videoTitle: string,
    videoDescription: string,
    videoUrl: string;
  }[]
}

interface CartItem {
  courseId: ObjectId;
}

export interface reviewProps{
  course:object | any;
}


export type Cart = Array<CartItem>


