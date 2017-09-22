const request = require('supertest');
const rewire = require('rewire');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3005;
const app = rewire('../restServer');

describe('pets restServer', function() {

  // runs before each test in this block
  // set up preconditions
  beforeEach(function() {
    let petsArr = [{
      age: 9,
      kind: 'Snake',
      name: 'Jeff'
    }, {
      age: 12,
      kind: 'Falcon',
      name: 'Xerxes'
    }];

    app.__set__({
      'fs': {
        readFile: function(path, encoding, cd) {
          if(/pets.json$/.test(path)) return cb(null,JSON.stringify(petsArr));
          cb(new Error('File does not exist'));
        },
        writeFile: function(path, data, cb) {
          if(/pets.json$/.test(path)) {
            petsArr = JSON.parse(data);
            return cb(null);
          }
          return cb(new Error('File does not exist'));
        }
      }
    });


  });

  // runs after each test in this block
  // cleanup after tests
  afterEach(function() {
    let petsArr = [{
      age: 9,
      kind: 'Snake',
      name: 'Jeff'
    }, {
      age: 12,
      kind: 'Falcon',
      name: 'Xerxes'
    }];
  });
});
