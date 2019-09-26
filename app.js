const fs = require("fs");
const express = require("express");

const MongoClient = require("mongodb").MongoClient;

const app = express();
const PORT = 8080;

const url = "mongodb://localhost:27017";

async function readTweets() {

  try {
    const client = new MongoClient(url);

    await client.connect();

    const db = client.db("nodeExpress");
    const colTweets = db.collection("tweets");

    const prom = colTweets.find({}).limit(20).toArray();
    const tweets = await prom;

    client.close();
    return tweets;
    
  } catch (err) {
    reject(err);
  }
  

  /* Version callbacks.
  client.connect((err) => {
    if(err) {
      reject(err);
      return;
    }

    console.log("Conectado a mongo.");
    const db = client.db("nodeExpress");
    const colTweets = db.collection("tweets");

    colTweets.find({})
    .limit(20)
    .toArray((err, tweets) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(tweets);
      client.close();
    });

  });*/
}

function readData (resolve, reject) {
  fs.readFile("gananLosCorruptos.json", (err, data) => {
    if(err) {
      reject(err);
      return;
    }

    const dataParsed = JSON.parse(data);
    console.log("Got data", dataParsed.length);

    resolve(dataParsed);
  });
}

app.get("/", (req, res) => {
  console.log("Got get /");
  
  readData(
    data => {
      res.send("Num: " + data.length);
      console.log("Done!");
    }, err => {
      res.send("Error cargando los datos.");
    }
    );
});

app.get("/data", async (req, res) => {

  const tweets = await readTweets();
  res.json(tweets);

});

app.listen(PORT, () => {
  console.log(`My app is running at http://localhost:${PORT}`);
});
