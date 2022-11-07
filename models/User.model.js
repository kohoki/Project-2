const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },
    credit: {
      type: Number
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
