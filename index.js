const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.pvc0uxo.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
   
    await client.connect();

    const db = client.db("shopSphere");
    const productsCollection = db.collection("products");

    // Products API Endpoint

    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/top-products', async (req, res) => {
      const cursor = productsCollection.find().limit(4);
      const topProducts = await cursor.toArray();
      res.send(topProducts);
    });

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Shop sphere is running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
