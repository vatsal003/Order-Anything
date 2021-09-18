const mongoose = require('mongoose')



const cartSchema = new mongoose.Schema({

	cart:[{
		//cartitem:{
			item:{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Item'	
			},
			quantity:{
				type: Number,
				default:1
			},
			pickup_location: {

				type: mongoose.Schema.Types.ObjectId,
				ref: 'Address'	

			},
		//}
	}],


})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart