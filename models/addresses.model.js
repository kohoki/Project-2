const { Schema, model } = require("mongoose");

const userAddressesSchema = new Schema(
  {
    uId: {
      type: String,
      required: true,
    },
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    aLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    }
   
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const userAddresses = model("userAddresses", userAddressesSchema);

module.exports = userAddresses;
