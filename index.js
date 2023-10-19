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
    app.get('/product', async(req, res) =>{
        const cursor = Product.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.post('/product', async(req, res) =>{
        const product = req.body
        console.log(product)
        const result = await Product.insertOne(product)
        res.send(result);
    })
    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await Product.findOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async(req, res) =>{
    res.send("My First MERN Stack Server")
})
app.listen(port, () =>{
    console.log('App listing on PORT:', port)
})