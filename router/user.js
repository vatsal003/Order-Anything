const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    
    try {
		if(req.body.isAdmin){
			delete req.body.isAdmin
		}
		//delete req.body.isAdmin
		const cart= await new Cart().save()
		req.body.cart=cart._id
		// console.log(cart._id)
		const user = new User(req.body)
		// const cart= await new Cart()
		
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})



router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.number, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/logout', auth.isLoggedIn, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutAll', auth.isLoggedIn, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

//Add item to cart
router.post('/addToCart', auth.isLoggedIn, async (req, res) => {
    try {
		const requireditem = req.body.item
		const quantity = req.body.quantity
		const cart = await Cart.findOne({_id:req.user.cart})
		//console.log(cart)
		const ind = getItemIndexinCart(cart.cart,requireditem)
		if (ind<0){
			
			//can be optimized
			const user=await User.find({_id:req.user._id})
			cart.cart.push({item:requireditem,quantity:quantity})
			await cart.save()
			
		}
		
		
		
		else{
			return res.status(400).send({message:"Item already exists in cart"})
		}
        res.status(200).send({cart})
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})


//View cart
router.get('/viewCart', auth.isLoggedIn, async (req, res) => {
    try {
		const requireditem = req.body.item
		const cart = await Cart.findOne({_id:req.user.cart}).populate('cart.item',"name category")
        res.status(200).send({cart})
    } catch (e) {
		console.log(e)
        res.status(500).send()
    }
})

//Remove item from cart
router.post('/removeFromCart', auth.isLoggedIn, async (req, res) => {
    try {
		const requireditem = req.body.item
		const cart = await Cart.findOne({_id:req.user.cart})
		const ind = getItemIndexinCart(cart.cart,requireditem)
		if (ind<0){
			return res.status(400).send({message:"Item does not exist in cart"})			
		}
		else{
			//can be optimized
			cart.cart.splice(ind,1)
			await cart.save()
			
		}
        res.status(200).send({cart})
    } catch (e) {
		console.log(e)
        res.status(500).send()
    }
})



router.post('/orderCanceled',auth.isLoggedIn, async (req, res) => { 
    try {
		let user = req.user
		const orderid = req.body.orderid
		const orders = await Order.findOneAndUpdate({user:user._id, _id:orderid}, {stage:"Canceled"},{
			new: true
		} )
		.populate('delivery_person','name number')
		.populate('user','name number')
		.populate({ 
   			 path: 'cart',
   			 populate: { path: 'cart.item', select:"id name category" }
 		 })
		.populate('cart.pickup_location');
		
        res.status(200).send({ orders })
    } catch (e) {
		console.log(e)
        res.status(500).send(e)
    }
})

//increase quantity of an item in cart
router.post('/addQuantityToCart', auth.isLoggedIn, async (req, res) => {
    try {
		const requireditem = req.body.item
		const addquantity = req.body.quantity
		const cart = await Cart.findOne({_id:req.user.cart})
		const ind = getItemIndexinCart(cart.cart,requireditem)
		if (ind<0){
			return res.status(400).send({message:"Item does not exist in cart"})
				
			
		}
		else{
			//can be optimized	
			
			cart.cart[ind].quantity += addquantity
			await cart.save()
		}
        res.status(200).send({cart})
    } catch (e) {
		console.log(e)
        res.status(500).send()
    }
})

//decrease quantity (or remove if 0) of an item in cart
router.post('/removeQuantityToCart', auth.isLoggedIn, async (req, res) => {
    try {
		const requireditem = req.body.item
		const removequantity = req.body.quantity
		const cart = await Cart.findOne({_id:req.user.cart})
		const ind = getItemIndexinCart(cart.cart,requireditem)
		if (ind<0){
			return res.status(400).send({message:"Item does not exist in cart"})	
			
		}
		else{
			//can be optimized	
			
			if(cart.cart[ind].quantity-removequantity<=0){
				cart.cart.splice(ind,1)
				
			}
			else{
				cart.cart[ind].quantity -= removequantity	
			}
			await cart.save()
		}
        res.status(200).send({cart:cart})
    } catch (e) {
		console.log(e)
        res.status(500).send()
    }
})


router.get('/me', auth.isLoggedIn, async (req, res) => {
    res.send(req.user)
})


const getItemIndexinCart=(cart,requiredItem)=>{
	return cart.findIndex((item)=>String(item.item) ===String( requiredItem))	
}

module.exports = router