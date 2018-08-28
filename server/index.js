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

  db.checkLogin(req.body.username, req.body.password, (err, result, userInfo) => {
    if (err) {
      console.log(err);
      res.status(404).json('User not found');
    } else {
      userInfo.authenticated = result;
      res.status(200).json(userInfo);
    }
  })
});

app.get('/signup/usernameavailability', (req, res) => {
  db.checkUsernameAvailability(req.query.username, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      res.status(200).json(result);
    }
  })
});

app.get('/getAppliedCount/:id', (req, res) => {
  console.log('Get applied: ', req.params.id);
  db.getAppliedCount(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      res.status(200).json(result);
    }
  })
});

app.put('/update/username', (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let id = req.body.id;
  db.updateUsername(id, username, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      res.status(200).json(result);
    }
  })
});

app.put('/update/password', (req, res) => {
  let password = req.body.password;
  let id = req.body.id;
  db.updatePassword(id, password, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      console.log('update password: ', result);
      res.status(200).json(result);
    }
  })
});

app.get('/check/email/:email', (req, res) => {
  console.log(req.params.email);
  db.checkEmailAvailability(req.params.email, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      console.log('Email result: ', result.rows);
      res.status(200).json(result.rows[0]);
    }
  })
});

app.put('/update/email', (req, res) => {
  let email = req.body.email;
  let id = req.body.id;
  db.updateEmail(id, email, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      console.log('update password: ', result);
      res.status(200).json(result);
    }
  })
});

app.put('/update/address', (req, res) => {
  let address = req.body.address;
  let id = req.body.id;
  db.updateAddress(id, address, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json('Error');
    } else {
      console.log('update address: ', result);
      res.status(200).json(result);
    }
  })
})

app.listen(port, () => {
  console.log(`Listening on ${port} port`);
})