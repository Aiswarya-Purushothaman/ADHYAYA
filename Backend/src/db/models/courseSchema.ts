import mongoose from "mongoose";
import Instructor from "./instructorSchema";

const sectionSchema = new mongoose.Schema({
  videoTitle: {
    type: String,
  },
  videoDescription: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

const courseSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Types.ObjectId,
    ref: "Instructor",
  },

  title: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  price: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  isApproved: {
    type: String,
    default:"pending"
  },
 

  reviews: [
    {
      studentId: {
        type: mongoose.Types.ObjectId,
      },
      comment: {
        type: String,
      },
    },
  ],
  level: {
    type: String,
  },
 
  sections: [sectionSchema],
})


const Course=mongoose.model("Course",courseSchema);
export default Course