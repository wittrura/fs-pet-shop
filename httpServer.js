const http = require('http');
const url = require('url');
const fs = require('fs');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // GET /pets
  if (req.method === 'GET' && req.url === '/pets') {
    let pets;
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      if (err) throw err;
      pets = JSON.parse(data);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(pets));
    });
    return;
  }

  // GET /pets/:int
  if (req.method === 'GET' && req.url.slice(0, 5) === '/pets' && req.url.slice(6)) {
    let pets;
    let petIndex = req.url.slice(6);
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      if (err) throw err;
      pets = JSON.parse(data);

      if (pets[petIndex]) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(pets[petIndex]));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }
    });
    return;
  }
  res.end('invalid route or method');
});

server.listen(8001, () => {
  console.log('listening on port 8001...');
});

module.exports = server;
