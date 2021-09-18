const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = new express.Router()


//Checkout i.e. generate an order from cart and create an array of pickup locations for this order
router.post('/checkout',auth.isLoggedIn, async (req, res) => { 
    try {
		let user = req.user
		let cart=await Cart.findOne({_id:user.cart}).populate("cart.item")
		cart.cart.forEach( function(item) {
			item.pickup_location = item._doc.item.addresses[Math.floor(Math.random() * item._doc.item.addresses.length)]
		})
		await cart.save()
		// cart.cart.forEach( function(rating) {
		//   console.log(rating)
		// 	rating.pickup_location=rating.item.addresses[0]
		// })
		// const x= await cart.save()
		// console.log(":hello",x)
		// return res.status(200)
		
		let order = await new Order({
			cart:user.cart,
			user:user._id	
		}).save()
		
		order=await Order.findOne({_id:order._id}).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		//.populate('cart.pickup_location');
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
		const newCart = await new Cart().save()
		user = await User.findOneAndUpdate({_id:user._id}, { cart: newCart._id })
        res.status(200).send({ order })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})


router.get('/myCurrentOrders',auth.isLoggedIn, async (req, res) => { 
    try {
		let user = req.user
		const orders = await Order.find({user:user._id, stage: {$nin: ["Delivered", "Canceled"]} }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
		
        res.status(200).send({ orders })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})

router.get('/myDeliveredOrders',auth.isLoggedIn, async (req, res) => { 
    try {
		let user = req.user
		const orders = await Order.find({user:user._id, stage: "Delivered" }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
		
        res.status(200).send({ orders })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})

router.get('/myOrdersByStage/:stage',auth.isLoggedIn, async (req, res) => { 
    try {
		let user = req.user
		let stage = req.params.stage
		const orders = await Order.find({user:user._id, stage }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
		
        res.status(200).send({ orders })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})



// router.post('/myCancelledOrders',auth.isLoggedIn, async (req, res) => { 
//     try {
// 		let user = req.user
// 		const orders = await Order.find({user:user._id, stage: "Canceled" })
		
//         res.status(200).send({ orders })
//     } catch (e) {
// 		console.log(e)
//         res.status(500).send(e)
//     }
// })


router.get('/myOrder/:id',auth.isLoggedIn, async (req, res) => { 
    try {
		let orderid = req.params.id
		const order = await Order.findOne({user:req.user._id, _id: orderid }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
		
        res.status(200).send({ order })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})



module.exports = router