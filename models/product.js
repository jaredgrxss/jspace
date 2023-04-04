const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({ 

    name: {
        type: String,
        required: true
    }, 
    
    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imageUrl1: {
        type: String,
        required: true,
    },

    imageUrl2: {
        type: String,
        required: true,
    },

    imageUrl3: {
        type: String,
        required: true
    },

    imageUrl4: {
        type: String,
        required: true
    },

    UID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    isApproved: {
        type: Boolean,
        required: true,
    },
    
    isPurchased: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);