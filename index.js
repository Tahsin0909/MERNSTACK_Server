const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://tajisan789:QSUtgMugCaTWpHhV@cluster0.uxzfht6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Create DataBAse
    const database = client.db('SignatureDrive')
    const Product = database.collection('Product')
    const User = database.collection('User')
    const UserCart = database.collection('UserCart')
    app.get('/product', async (req, res) => {
      const cursor = Product.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post('/product', async (req, res) => {
      const product = req.body
      // console.log(product)
      const result = await Product.insertOne(product)
      res.send(result);
    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await Product.findOne(query)
      res.send(result)
    })
    app.get('/product/:brand', async (req, res) => {
      const id = req.params.brand
      console.log(id)
      const query = { brand: new Object(toString(id)) }
      const result = await Product.findOne(query)
      res.send(result)
    })
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await Product.deleteOne(query)
      res.send(result)
    })
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id
      const PrevProduct = req.body;
      // console.log(id, PrevProduct)
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const UpdateProduct = {
        $set: {
          brand: PrevProduct.brand,
          model: PrevProduct.model,
          price: PrevProduct.price,
          rating: PrevProduct.rating,
          description: PrevProduct.description,
          seatingCapacity: PrevProduct.seatingCapacity,
          mileage: PrevProduct.mileage,
          acceleration: PrevProduct.acceleration,
          engine: PrevProduct.engine,
          transmission: PrevProduct.transmission,
          fueltype: PrevProduct.fueltype,
          technology_1: PrevProduct.technology_1,
          technology_2: PrevProduct.technology_2,
          photo_url: PrevProduct.photo_url
        }
      }
      const result = await Product.updateOne(filter, UpdateProduct, options)
      res.send(result)
    })
    //User
    app.post('/user', async (req, res) => {
      const user = req.body
      console.log(user)
      const result = await User.insertOne(user)
      res.send(result);
    })
    app.get('/user', async (req, res) => {
      const cursor = User.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { uid: id }
      const result = await User.findOne(query)
      res.send(result)
    })
    // app.get('/user/:id/myCart', async (req, res) => {
    //   const id = req.params.id
    //   console.log(id, req.params.myCart)
    //   const query = {"myCart": myCart}
    //   const result = await User.findOne(query)
    //   res.send(result)
    // })
    app.post('/myCart', async (req, res) => {
      const id = req.params.id
      const CartData = req.body
      const filter = { uid: id }
      console.log(CartData);
      const options = { upsert: true }
      // const UserData = await User.findOne(filter)
      // console.log(UserData);
      const query = {
        CarId: CartData.id,
        UId: CartData.uId,
        model: CartData.model
      }
      const UpdateCart = {
        $set:
        {
          UId: CartData.uId,
          model: CartData.model,
          CarId: CartData.id,
          CarPhoto: CartData.photo_url,
          CarBrand: CartData.brand,
          CarRating: CartData.rating,
          CarPrice: CartData.price
        }

      };
      const result = await UserCart.updateOne(query, UpdateCart, options)
      res.send(result)
    })
    app.get('/myCart', async (req, res) => {
      const cursor = UserCart.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/myCart/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { UId: id }
      // const options = {
      //   projection: {UId: id}
      // }
      const cursor = UserCart.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.delete('/myCart/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await UserCart.deleteOne(query)
      res.send(result)
    })
    //User CArt


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
  res.send("My First MERN Stack Server")
})
app.listen(port, () => {
  console.log('App listing on PORT:', port)
})