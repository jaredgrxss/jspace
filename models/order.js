const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    
    orderProducts: [
        {
            product: {
                type: Object,
                required: true,
            }
        }
    ],

    UID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model('Order', orderSchema);