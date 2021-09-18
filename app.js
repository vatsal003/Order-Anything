const express = require('express')
require('dotenv').config();

require('./db/db')

const userRouter = require('./router/user')
const adminRouter = require('./router/admin')
const companyRouter = require('./router/company')
const orderRouter = require('./router/order')
const delivery_personRouter = require('./router/delivery_person')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use("/users",userRouter)
app.use("/admin",adminRouter)
app.use("/company",companyRouter)
app.use("/order",orderRouter)
app.use("/delivery",delivery_personRouter)


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})
