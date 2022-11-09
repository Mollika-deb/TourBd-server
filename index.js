const express = require('express');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ineyp7q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const serviceCollection = client.db('tourBD').collection('services');
     const reviewCollection = client.db('tourBD').collection('reviews');


        app.get('/services', async (req, res) => {
            const query = {};
            const coursor = serviceCollection.find(query);
            const services = await coursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/allservices', async (req, res) => {
            const query = {};
            const coursor = serviceCollection.find(query);
            const services = await coursor.toArray();
            res.send(services);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // app.get('/orders', async (req, res) => {

        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders)
        // })


        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result)
        // })
    }
    finally {

    }
}

run().catch(err => console.error(err))



app.get('/', (req, res)=>{
    res.send('assignment')
});

app.listen(port,()=>{
    console.log(`server is runing ${port}`)
})