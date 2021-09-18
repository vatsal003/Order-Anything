const mongoose = require('mongoose')
const validator = require('validator')



const itemSchema = new mongoose.Schema({
    // quantity: {
    //     type: Number,
    //     required: true,	
    // },
    name: {
        type: String,
		required: true,
        trim: true,		
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
		required: true,
        ref: 'Category'	
    },


	addresses: [{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Adress'
	}],
	
	

})




const Item = mongoose.model('Item', itemSchema)

module.exports = Item