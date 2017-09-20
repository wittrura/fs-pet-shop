const express = require('express');
const fs = require('fs');

const app = express();

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      if (err) throw err;
      resolve(JSON.parse(data));
    });
  });
}

app.get('/pets', function (req, res) {
  readFile()
    .then((data) => {
      let pets = data;
      res.send(pets);
    });
});

app.get('/pets/:id', function (req, res) {
  readFile()
    .then((data) => {
      let pets = data;
      let id = req.params.id

      if (pets[id]) {
        res.send(pets[id]);
      } else {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Not Found');
      }
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app;
