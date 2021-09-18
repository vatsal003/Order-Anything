const express = require('express')
const auth = require('../middleware/auth')
const Category = require('../models/category')
const Address = require('../models/address')
const Item = require('../models/item')
const Users = require('../models/user')
const Orders = require('../models/order')
const router = new express.Router()



//Get list of all delivery persons
router.get('/deliveryPersons',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		const users = await Users.find({ isDeliveryPerson: true })
        res.status(200).send({ users })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

//Assign a delivery person to an order
router.post('/assigndeliveryPerson',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		const orderid = req.body.orderid
		const delivery_person = req.body.delivery_person
		
		//console.log(delivery_person)
		
		const order = await Orders.findOneAndUpdate( { _id:orderid , delivery_person: { $exists: false }},{ $set: { delivery_person:delivery_person }},{new: true} )
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
        res.status(400).send(e)
    }
})



//Get all orders ( by status) which are assigned to a delivery person
router.get('/checkAssignedOrders/:stage',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		let stage = req.params.stage
		const assignedOrders = await Orders.find({ delivery_person: { $exists: true }, stage }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
        res.status(200).send({ assignedOrders })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

//Get all orders ( by status) which are not assigned to a delivery person
router.get('/checkUnassignedOrders/:stage',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		let stage = req.params.stage
		const unassignedOrders = await Orders.find({ delivery_person: { $exists: false }, stage }).populate('delivery_person','name number')
		.populate('user','name number')
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.item' , select:"id name category"}
 		 })
		.populate({
   			 path: 'cart',
   			 populate: { path: 'cart.pickup_location' }
 		 })
        res.status(200).send({ unassignedOrders })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

//Get an order by Id

router.get('/order/:id',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		let _id = req.params.id
		const order = await Orders.findOne({ _id }).populate('delivery_person','name number')
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
        res.status(400).send(e)
    }
})



router.post('/addCategory',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		const category=new Category(req.body)
        await category.save()
        res.status(200).send({ message: "Category successfully added." })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

router.post('/addItem',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		const item=new Item(req.body)
        await item.save()
        res.status(200).send({ message: "Item successfully added." })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

router.post('/addAddress',auth.isLoggedIn, auth.isAdmin, async (req, res) => {
    try {
		const address = new Address(req.body)
        await address.save()
        res.status(200).send({ message: "Address successfully added." })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router