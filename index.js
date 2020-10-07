const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuz7l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventsCollection = client.db("volunteerNetwork").collection("events");
  const Collection = client
    .db("volunteerNetwork")
    .collection("eventRegistration");

  app.post("/addEvents", (req, res) => {
    const events = req.body;
    console.log(events);
    eventsCollection.insertOne(events).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/events", (req, res) => {
    eventsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addUser", (req, res) => {
    const newRegistration = req.body;
    console.log("new", newRegistration);
    Collection.insertOne(newRegistration).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
   
  });

  app.get("/userEvents", (req, res) => {
    Collection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/registration/:id", (req, res) => {
    eventsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        console.log(documents);
        res.send(documents[0]);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    Collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      console.log(result.deletedCount);
      res.send(result);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen( process.env.PORT || port);
