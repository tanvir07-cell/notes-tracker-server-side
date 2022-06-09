const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // get api : localhost:5000/notes
    app.get("/notes", async (req, res) => {
      const query = req.query;
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      console.log(query);
    });

    // Post data:
    // post api : localhost:5000/note
    app.post("/note", async (req, res) => {
      const post = req.body;

      const result = await notesCollection.insertOne(post);
      res.send(result);

      //   console.log(req.body);
      //   res.send("Hello from the post api");
    });

    // update data:
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: body.name,
          Age: body.Age,
        },
      };
      const result = await notesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete data:
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await notesCollection.deleteOne(query);
      res.send(result);
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
