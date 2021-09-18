const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL).then(() => console.log("Database connected!"))
 .catch(err => console.log(err));



// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://api:<password>@cluster0.tswla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });