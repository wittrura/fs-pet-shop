const fs = require('fs');

if (process.argv.length === 2) {
  console.error("Usage: node pets.js [read | create | update | destroy]");
}

if (process.argv[2] === 'read') {
  fs.readFile('./pets.json', (err, data) => {
    if (err) throw err;
    let pets = JSON.parse(data);
    if (process.argv[3]) {
      let readOption = process.argv[3];
      if (pets[readOption]) {
        console.log(pets[readOption]);
      } else {
        console.error("Usage: node pets.js read INDEX");
      }
    }
  })
}

if (process.argv[2] === 'create') {
  if (process.argv.length !== 6) {
    console.error("Usage: node pets.js create AGE KIND NAME");
  } else {
    fs.readFile('./pets.json', (err, data) => {
      if (err) throw err;
      let pets = JSON.parse(data);
      let newPet = {
        age: parseInt(process.argv[3]),
        kind: process.argv[4],
        name: process.argv[5]};
        pets.push(newPet);
        fs.writeFile('./pets.json', JSON.stringify(pets), (err) => {
          if (err) throw err;
        });
        console.log(newPet);
    })
  }
}
