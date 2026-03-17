import mongoose from "mongoose";
import User from "./studentSchema";
import Course from "./courseSchema";

const Enrolled = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  Sections: [
    {
      sectionId: {
        type: mongoose.Types.ObjectId,ref:"Course.sections"
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    completed:{
      type: Boolean,
      default: false,
    }
    },
  ],
});

const Enrollments = new mongoose.Schema({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  Courses: {
    type: [Enrolled],
  },
  Total: {
    type: Number,
  },
  EnrolledAt:{
    type:Date,
    default:Date.now()
  }
});
const EnrollmentSchema = mongoose.model('Enrollments',Enrollments)

export default EnrollmentSchema