const { Schema, model } = require("mongoose");

const sCartSchema = new Schema({
    uId: {
        type: String,
        required: true,
        },
    product: [{
        pId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
        }],
    purchased: {
        type: Boolean,
        default: false
    }      
})

const SCart = model('SCart', sCartSchema);

module.exports = SCart;