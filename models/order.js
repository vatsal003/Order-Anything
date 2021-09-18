const mongoose = require('mongoose')



const orderSchema = new mongoose.Schema({

	cart:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Cart'	
	},
	stage:{
		type: String,
		enum:["Task Created", "Reached Store", "Items Picked", "Enroute", "Delivered", "Canceled"],
		default:"Task Created",
		
		
	},

    user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'	
	},
	//////
    delivery_person: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'	
	},
	
    // pickup_locations: [{
         
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address'	
        
    // }],
	


}, {
    timestamps: true
})



const Order = mongoose.model('Order', orderSchema)

module.exports = Order