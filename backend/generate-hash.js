// generate-hash.js
const bcrypt = require('bcryptjs');

const password = '123456'; // plain password
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed password:', hashedPassword);



