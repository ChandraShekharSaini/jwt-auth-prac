import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },

    password: {
      type: String,
      required: true,
    },

    token:{
        type: String,
        default: undefined,
      },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
