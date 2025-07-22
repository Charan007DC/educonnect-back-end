const bcrypt = require('bcryptjs');

// Choose your password
const plainPassword = 'Admin@1234';

// Hash it
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Hashed Password:', hashedPassword);
  }
});
