const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const port = process.env.PORT || 5000


app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

app.get('/', (req, res) => {
  res.send("This is Dentist Park Server Created By Zahirul Islam Akash")
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apc6x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("dentistPark").collection("service");
  const bookingCollection = client.db("dentistPark").collection("bookings");
  
  app.get('/service', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items);
    })
  })
  app.get('/booking', (req, res) => {
    bookingCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items);
    })
  })

  app.get(`/service/:id`, (req, res) => {
    serviceCollection.find({
      _id: ObjectID(req.params.id)
    })
    .toArray((err, items) => {
      res.send(items);
      console.log(items);
    })
  })

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    console.log('adding new booking', newBooking);
    bookingCollection.insertOne(newBooking)
    .then(result => {
      console.log('insert count', result);
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})