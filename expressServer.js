const express = require('express');
const fs = require('fs');
var bodyParser = require('body-parser');

const app = express();


function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      // reject on errors, or resolve with data from file
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
}

// create application/json parser
var jsonParser = bodyParser.json()


app.get('/pets', function (req, res, next) {
  readFile()
    .then((data) => {
      let pets = data;
      res.send(pets);
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/pets', jsonParser, function (req, res, next) {
  if (!req.body) return res.sendStatus(400);

  readFile()
    .then((data) => {
      let pets = data;

      if (req.body.name && !Number.isNaN(req.body.age) && req.body.kind) {
        let newPet = {
          name: req.body.name,
          age: req.body.age,
          kind: req.body.kind
        };

        pets.push(newPet);
        fs.writeFile('./pets.json', JSON.stringify(pets), (err) => {
          if (err) { return next(err); }
        });

        res.send(newPet);
      } else {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad Request');
      }

    })
    .catch((err) => {
      next(err);
    });
});

app.get('/pets/:id', function (req, res, next) {
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
    })
    .catch((err) => {
      next(err);
    });
});

app.use(function (req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.status(404).send('Not Found');
});

app.use(function(err, req, res, next) {
    console.error('error handler hit');
    res.status(err.status || 500);
    res.send('Internal Server Error');
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
