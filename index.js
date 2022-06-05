const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// for .env file(eita nah dile bad auth error dekahbe):
require("dotenv").config();

// middleware:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i1ntq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const notesCollection = client.db("noteTrackers").collection("notes");

    //   get data :
    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Post data:
    app.post("/note", async (req, res) => {
      const post = req.body;

      const result = await notesCollection.insertOne(post);
      res.send(result);

      //   console.log(req.body);
      //   res.send("Hello from the post api");
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Running to the port ${port}`);
});
