const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    password: {
        type: String, 
        required: true,
    },

    isAdmin: {
        type: Boolean,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Product',
                    required: true
                }
            }
        ]
    }

});

userSchema.methods.addToCart = function(product) {
    const CPI = this.cart.items.findIndex(cart_product => {
        return cart_product.productId.toString() === product._id.toString();
    });
    const updated_cart = [...this.cart.items];
    if (CPI >= 0){
        return this.save()
    } else {
        updated_cart.push({
            productId : product._id,
        });
    }
    const new_cart = {
        items : updated_cart
    }
    this.cart = new_cart;
    return this.save();
};

userSchema.methods.deleteItemsFromCart = function(prodId) {
    const updated_cart = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString();
    });
    this.cart.itmes = updated_cart;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);