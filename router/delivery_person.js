const express = require('express')
const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')
const auth = require('../middleware/auth')
const router = new express.Router()


//Get a list of Orders to be delivered or in delivery progress
router.get('/myCurrentOrders',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const orders = await Order.find({delivery_person:user._id, stage: {$nin: ["Delivered", "Canceled"]} })
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category" }
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



//Get a list of Orders by their stage
router.get('/myOrdersByStage/:stage',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const stage = req.params.stage
		const orders = await Order.find({delivery_person:user._id, stage} )
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category" }
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


//Move an order to Items Picked stage
router.post('/itemsPicked',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const orderid = req.body.orderid
		const orders = await Order.findOneAndUpdate({delivery_person:user._id, _id:orderid}, {stage:"Items Picked"},{
			new: true
		} )
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({ 
   			 path: 'cart',
   			 populate: { path: 'cart.item'  , select:"id name category"}
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


//Move an order to Enroute stage
router.post('/orderEnroute',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const orderid = req.body.orderid
		const orders = await Order.findOneAndUpdate({delivery_person:user._id, _id:orderid}, {stage:"Enroute"},{
			new: true
		} )
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({ 
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category" }
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

//Move an order to Delivered stage
router.post('/orderDelivered',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const orderid = req.body.orderid
		const orders = await Order.findOneAndUpdate({delivery_person:user._id, _id:orderid}, {stage:"Delivered"},{
			new: true
		} )
		.populate('delivery_person','name number')
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

//Move an order to Canceled stage
router.post('/orderCanceled',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		const orderid = req.body.orderid
		const orders = await Order.findOneAndUpdate({delivery_person:user._id, _id:orderid}, {stage:"Canceled"},{
			new: true
		} )
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({ 
   			 path: 'cart',
   			 populate: { path: 'cart.item', select:"id name category" }
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
// router.post('/myDeliveredOrders',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
//     try {
// 		let user = req.user
// 		const orders = await Order().find({delivery_person:user._id, stage: "Delivered"} )
// 		.populate('delivery_person','name number')
// 		.populate('user','name number')
// 		.populate('pickup_locations')
// 		.populate({
//    			 path: 'cart',
//    			 populate: { path: 'item' }
//  		 });
		
//         res.status(200).send({ orders })
//     } catch (e) {
// 		console.log(e)
//         res.status(500).send(e)
//     }
// })

// router.post('/myCanceledOrders',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
//     try {
// 		let user = req.user
// 		const orders = await Order().find({delivery_person:user._id, stage: "Canceled"} )
// 		.populate('delivery_person','name number')
// 		.populate('user','name number')
// 		.populate('pickup_locations')
// 		.populate({
//    			 path: 'cart',
//    			 populate: { path: 'item' }
//  		 });
		
//         res.status(200).send({ orders })
//     } catch (e) {
// 		console.log(e)
//         res.status(500).send(e)
//     }
// })


router.get('/myOrder/:id',auth.isLoggedIn, auth.isDeliveryPerson, async (req, res) => { 
    try {
		let user = req.user
		let orderid = req.params.id
		const order = await Order.findOne({delivery_person:user._id, _id:orderid} )
		.populate('delivery_person','name number')
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