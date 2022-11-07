const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    description: {
      type: [String],
      required: true
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
