const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('../database/postgres.js');

let app = express();
const port = 4809;

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// db.saveUserInit({username: 'ansonao',
//               password: 'ansonaoisawesome',
//               email: 'ansonao10@gmail.com'
//             });
// db.saveUserInit({username: 'jaebae',
//               password: 'jaebaeisbae',
//               email: 'jaebae1111@gmail.com'
//             });
// db.saveUserInit({username: 'thunyugen',
//               password: 'thuisthumuch',
//               email: 'alilthumuch@gmail.com'
//             });

app.post('/signup/newuser', (req, res) => {
  // db.signup(req.body, (req, res) => {

  // })
  console.log(req.body);
  db.saveUserInit(req.body, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).json({result: 'Error'});
    } else {
      res.status(200).json(data);
    }
  })
})

app.post('/login', (req, res) => {
  console.log(req.body);
  let category = 'username';
  if (req.body.username.indexOf('@') > 0) {
    category = 'email';
  }
  db.checkLogin(req.body.username, req.body.password, category, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('User not found');
    } else {
      res.status(200).json(result);
    }
  })
});

app.listen(port, () => {
  console.log(`Listening on ${port} port`);
})