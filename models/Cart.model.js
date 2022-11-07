const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product:
        {
            type: [Schema.Types.ObjectId],
            ref: 'Product',
        }
        
})

const Cart = model('Cart', cartSchema);

module.exports = Cart;