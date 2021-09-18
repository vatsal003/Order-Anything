const mongoose = require('mongoose')



const addressSchema = new mongoose.Schema({
    flat_street: {
        type: String,
        required: true,
        trim: true,
		
    },
    locality: {
        type: String,
		required: true,
        trim: true,		
    },
	landmark: {
        type: String,
        trim: true,		
    },
	city: {
        type: String,
		required: true,
        trim: true,		
    },
	pincode: {
        type: Number,
		required: true,		
    },
	state: {
        type: String,
		required: true,
        trim: true,		
    },

	latitude: {
        type: mongoose.Decimal128,
		required: true,
        	
    },
	longitude: {
        type: mongoose.Decimal128,
		required: true,
        	
    },
	

})



const Address = mongoose.model('Address', addressSchema)

module.exports = Address