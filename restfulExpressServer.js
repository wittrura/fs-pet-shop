const express = require('express');

var bodyParser = require('body-parser');
var fs = require('fs');
var morgan = require('morgan');
var auth = require('basic-auth')

// read data from JSON file
function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      // reject on errors, or resolve with data from file
      err ? reject(err) : resolve(JSON.parse(data))
    });
  });
}

const app = express();

// parse application/json
app.use(bodyParser.json());

// logging to STDOUT
// app.use(morgan('combined'));
app.use(morgan('dev'));

// Authentication module.
app.use(function(req, res, next) {
  // console.log(req);
  var user = auth(req);
  if (user === undefined || user['name'] !== 'admin' || user['pass'] !== 'meowmix') {
      res.statusCode = 401;
      res.set('Content-Type', 'text/plain');
      res.setHeader('WWW-Authenticate', 'Basic realm="Required"');
      res.end('Unauthorized');
  } else {
    // console.log('passed auth');
    next();
  }
});


app.get('/pets', function(req, res, next) {
  readFile()
    .then((data) => {
      let pets = data;
      res.send(pets);
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/pets', function(req, res, next) {
  readFile()
    .then((data) => {
      let pets = data;
      let body = req.body;

      if(body.name && body.kind && !Number.isNaN(body.age)){
        let newPet = {
          name: body.name,
          age: body.age,
          kind: body.kind
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

app.get('/pets/:id', function(req, res) {
  readFile()
    .then((data) => {
      let pets = data;

      if (pets[req.params.id]) {
        res.send(pets[req.params.id]);
      } else {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.patch('/pets/:id', function(req, res) {
  readFile()
    .then((data) => {
      let pets = data;
      let body = req.body;

      if (!pets[req.params.id]) {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Not Found');
      }

      if ((Number.isInteger(body.age) || body.kind || body.name )) {
        let petToPatch = pets[req.params.id];

        if (Number.isInteger(body.age)) {
          petToPatch.age = body.age;
        }
        if (body.kind) {
          petToPatch.kind = body.kind;
        }
        if (body.name) {
          petToPatch.name = body.name;
        }

        fs.writeFile('./pets.json', JSON.stringify(pets), (err) => {
          if (err) { return next(err); }
        });
        res.send(pets[req.params.id]);
      } else {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad Request');
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete('/pets/:id', function(req, res) {
  readFile()
    .then((data) => {
      let pets = data;

      if (pets[req.params.id]) {
        let petToDelete = pets.splice([req.params.id], 1);

        fs.writeFile('./pets.json', JSON.stringify(pets), (err) => {
          if (err) { return next(err); }
        });

        res.send(petToDelete[0]);
      } else {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Not Found');
      }
    })
    .catch((err) => {
      next(err);
    });
});

// default route - handler if no previous routes are hit
app.use(function(req, res) {
  res.set('Content-Type', 'text/plain')
     .status(404)
     .send("Not Found");
});
// internal error, to handle errors in requesting data from services
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
