const express = require('express')
const auth = require('../middleware/auth')
const Category = require('../models/category')
const Address = require('../models/address')
const Items = require('../models/item')
const router = new express.Router()

router.get('/getCategories', async (req, res) => {
    try {
		const category=await Category.find({});
        res.status(200).send({ category })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})


router.get('/getItems/:category', async (req, res) => {
    try {
		const category=req.params.category
		const items = await Items.find({category:category}).populate("category");
        res.status(200).send({ items })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})


router.get('/orderStatus', async (req, res) => {
    try {
		const orderstatus=["Task Created", "Reached Store", "Items Picked", "Enroute", "Delivered", "Canceled"]
        res.status(200).send({ orderstatus })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})


router.get('/getAddress/:id', async (req, res) => {
    try {
		const address = await Address.find({_id:req.params.id});
        res.status(200).send({ address })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

router.get('/getAddresses', async (req, res) => {
    try {
		const addresses = await Address.find({});
        res.status(200).send({ addresses })
    } catch (e) {
		console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router