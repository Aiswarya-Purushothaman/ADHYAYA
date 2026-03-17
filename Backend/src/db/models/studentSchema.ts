import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: Number,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    googleUserId: {
      type: String,
      default: null,
    },
    reviews: {
      type:[mongoose.Types.ObjectId],
      ref:'Course',
      require:true
    },

    cart: [
      {
        courseId: {
          type: mongoose.Types.ObjectId,
          ref: "Course",
        },
        _id: false,
      },
    ],
    saved: [
      {
        courseId: {
          type: mongoose.Types.ObjectId,
          ref: "Course",
        },
        _id: false,
      },
    ],
    enrollments: {
      type: [mongoose.Types.ObjectId],
      ref: "Enrollments",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  if (!this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
