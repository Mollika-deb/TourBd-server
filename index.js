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


        app.get('/reviews', async (req, res) => {

            let query = {};
            const email = req.query.email;
            if (email) {
                query = {
                    email: email,
                }
            }
            const cursor = reviewCollection.find(query).sort({timestamp: -1});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
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