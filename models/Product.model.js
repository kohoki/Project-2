const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
    },
    picture: {
      type: String,
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
