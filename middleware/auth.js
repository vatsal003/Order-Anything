const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth={}
const isLoggedIn = async (req, res, next) => {
    try {
		//console.log("auth",req.body)
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
		//console.log("eauth",req.body)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}


const isAdmin = async (req, res, next) => {
    try {
        
        if ( (!req.user) || (!req.user.isAdmin) ) {
            throw new Error()
        }
        next()
    } catch (e) {
		//console.log("eauth",req.body)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}


const isDeliveryPerson = async (req, res, next) => {
    try {
        
        if ( (!req.user) || (!req.user.isDeliveryPerson) ) {
            throw new Error()
        }
        next()
    } catch (e) {
		//console.log("eauth",req.body)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

auth.isDeliveryPerson = isDeliveryPerson
auth.isAdmin = isAdmin
auth.isLoggedIn = isLoggedIn

module.exports = auth