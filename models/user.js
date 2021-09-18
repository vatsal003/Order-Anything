const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Cart = require('./cart')


const userSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
		unique: true,
        trim: true,
			// validate(value) {
			// if (!validator.isMobilePhone(value,)) {
			// throw new Error('Email is invalid')
			// }
			// validator.isMobilePhone(value,)
			// }
		
    },
    name: {
        type: String,
		default:"Anonymous",
        trim: true,		
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
	//maybe change
	cart:{
		type: mongoose.Schema.Types.ObjectId,
		required:true,
		ref: 'Cart'	
	},

	
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
	isDeliveryPerson: { 
		type: Boolean, 
		default: false 
	},
	
	isAdmin: { 
		type: Boolean, 
		default: false 
	},


}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (number, password) => {
    const user = await User.findOne({ number })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// // Delete user tasks when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Blog.deleteMany({ author: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User