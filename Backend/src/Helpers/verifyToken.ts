import jwt from "jsonwebtoken";
import User from "../db/models/studentSchema";
import Instructor from "../db/models/instructorSchema";

export async function VerifyToken(token: string):Promise<any> {
  const decoded = jwt.verify(token, process.env.JWT_Access_SecretKey as string);
  if (decoded && typeof decoded !== "string" && "userId" in decoded) {
    const userId = decoded.userId;
    const role = decoded.role;
    if (role === "Student") {
      const user = await User.findById(userId);
      return { user, role };
    }
    if (role === "Instructor") {
      const user = await Instructor.findById(userId);
      return { user, role };
    }
  }
}
