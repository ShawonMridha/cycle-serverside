const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors')
require('dotenv').config();

const app = express()
const port =process.env.PORT || 5000;

//midlewear
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbah7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)


async function run() {
    try{
        await client.connect();
        // console.log('connected to databased');
        const database = client.db('bycycleStore');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const cycleCollection = database.collection('client');
        const serviceCollection= database.collection('service');
        const reviewCollection = database.collection('review');
        

        app.get('/products', async(req, res) => {
          const cursor = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        })


        //client get api
        // app.get('/client', async(req, res) => {
        //   const cursor = clientCollection.find({});
        //   const products = await cursor.toArray();
        //   res.send(products)
        // })

        //  get single service
        app.get('/products/:id', async(req, res) => {
          const id = req.params.id;
          // console.log('gettins specific id',id)
          const query = {_id: ObjectId(id)};
          const service = await productsCollection.findOne(query);
          res.json(service);
        })


        app.post('/client', async(req, res) => {
          const buy = req.body;
          const item = await cycleCollection.insertOne(buy);
          res.json(item);
        })


        app.get('/client', async(req, res) => {
          const cursor = cycleCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        })


        // delete Api
        app.delete('/client/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await cycleCollection.deleteOne(query)
        res.json(result);
      })


      //Add new service
      app.post('/service', async(req, res) => {
        const buy = req.body;
        const item = await serviceCollection.insertOne(buy);
        res.json(item);
      });


      app.get('/service', async(req, res) => {
        const cursor = serviceCollection.find({});
        const products = await cursor.toArray();
        res.send(products)
      })


      //Review section
      app.post('/review', async(req, res) => {
        const detail = req.body;
        const item = await reviewCollection.insertOne(detail);
        res.json(item);
      });

      app.get('/review', async(req, res) => {
        const cursor = reviewCollection.find({});
        const products = await cursor.toArray();
        res.send(products)
      })
      
 

    app.get('/users/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role ==='admin'){
        isAdmin= true;
      }
      res.json({admin: isAdmin});
    })


    app.post('/users', async(req, res) =>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result)
    });



    app.put('/users', async(req, res) => {
      const user = req.body;
      console.log('put', user)
      const filter = {email: user.email};
      const options = {upsert: true};
      const updateDoc = {$set:user};
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })


    app.put('/users/admin', async(req, res) => {
      const user = req.body;
      console.log('put', user);
      const filter= {email: user.email};
      const updateDoc={$set:{role:'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.json(result);
    })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('online cycle store')
})

app.listen(port, () => {
  console.log('cycle store connected successfully')
})