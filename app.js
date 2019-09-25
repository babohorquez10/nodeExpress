const fs = require("fs");
const express = require("express");

const app = express();
const PORT = 8080;

function readData (resolve, reject) {
  fs.readFile("gananLosCorruptos.json", (err, data) => {
    if(err) {
      reject(err);
      throw err;
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


app.listen(PORT, () => {
  console.log(`My app is running at http://localhost:${PORT}`);
});
