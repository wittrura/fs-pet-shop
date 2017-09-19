/*jshint esversion: 6 */

const http = require('http');
const url = require('url');
const fs = require('fs');

const petRegExp = /^\/pets\/(.*)$/;


function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      if (err) throw err;
      resolve(JSON.parse(data));
    });
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  // GET /pets
  if (req.method === 'GET' && /^\/pets$/.test(req.url)) {
    readFile()
      .then((info) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(info));
      });
      return;
  }

  // POST /pets
  if (req.method === 'POST' && /^\/pets$/.test(req.url)) {
    let body = [];
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();

      let newPet = JSON.parse(body);

      if (newPet.name && newPet.kind && /^\d*$/.test(newPet.age)) {
        // if the request is good
        readFile()
        .then((info) => {
          info.push(newPet);
          fs.writeFile('./pets.json', JSON.stringify(info), (err) => {
            if (err) throw err;
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newPet));
        });
      } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');
      }

    });
    return;
  }

  // GET /pets/:int
  if (req.method === 'GET' && petRegExp.test(req.url)) {
    let pets;
    let petIndex = req.url.slice(6);

    readFile()
      .then((info) => {
        if (info[petIndex]) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(info[petIndex]));
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');
        }
      });
    return;
  }

  // default, error route
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
});

server.listen(8001, () => {
  console.log('listening on port 8001...');
});

module.exports = server;
