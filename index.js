const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.52gi70p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    //await client.connect();

    const productsCollection = client.db("job-task").collection("products");

    app.get('/products', async (req, res) => {
      try {
        const results = await productsCollection.find().toArray();
        res.send(results);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Optionally close the client if needed
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Product Server Is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
