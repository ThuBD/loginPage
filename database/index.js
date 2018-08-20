const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/ssearche');

const userSchema = mongoose.Schema({
  "username": String,
  "password": String,
  "user_email": String,
  "created_at": {type: Date, default: Date.now},
  "jobs": [{type: mongoose.Schema.Types.ObjectId, ref: 'Jobs'}],
  "graphs": [{type: mongoose.Schema.Types.ObjectId, ref: 'Graphs'}] // id of the graphs
});

const jobsSchema = mongoose.Schema({
  "company_name": String,
  "position": String,
  "location": String,
  "expected_salary": Number,
  "home_address": String,
  "position_description": String,
  "resume_or_cv": String,
  "cover_letter": String,
  "personal_rating": Number,
  "created_at": {type: Date, default: Date.now},
  "display": Boolean
})

const graphsSchema = mongoose.Schema({
  "applications": Array,
  "application_status": Array,
  "offered_salaries": Array,
  "stages": Array,
  "self_reflection": Array
});

const Users = mongoose.model('Users', userSchema);
const Jobs = mongoose.model('Jobs', jobsSchema);
const Graphs = mongoose.model('Graphs', graphsSchema);

const saveUserInit = (userInput) => {
  bcrypt.hash(userInput.password, 10, (err, res) => {
    if (err) {
      console.log(err);
      return;
    } else {
      Users.find({username: userInput.username}, (err, user) => {
        if (user.length > 0) {
          console.log('Already have user');
        } else {
          var data = {};
          data.username = userInput.username;
          data.password = res;
          data.user_email = userInput.email;
          // var month = currentTime.getMonth() + 1;
          // var date = currentTime.getDate();
          // var year = currentTime.getFullYear();
          // var hour = currentTime.getHours();
          // var minute = currentTime.getMinutes();
          // var second = currentTime.getSeconds();
          // data.created_at = `${month}/${date}/${year} ${hour}:${minute}:${second}`;
          data.jobs = [];
          data.graphs = [];
          let newUser = new Users(data);
          newUser.save((err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log('successfully saved');
              console.log(data);
            }
          })
        }
      })
    }
  })  
};

const getUserId = (username, callback) => {
  Users.find({username: username}, (err, user) => {
    if (err) {
      callback(err);
    } else {
      callback(null, user[0]._id);
    }
  });
}

const saveJob = (username, details) => {
  getUserId(username, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      let job = new Jobs(details);
      job.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data._id);
          Users.findOneAndUpdate({_id: user._id}, {$push: {jobs: data._id}}, (err, saved) => {
            if (err) {
              console.log(err);
            } else {
              console.log('saved', saved);
            }
          });
        }
      })
    }
  })
};

const checkLogin = (identifier, password, category, callback) => {
  let option;
  if (category === 'username') {
    option = {username: identifier};
  } else {
    option = {user_email: identifier};
  }
  Users.find(option, (err, docs) => {
    bcrypt.compare(password, docs[0].password, (err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res);
      }
    })
    // callback(err, docs);
  });
  // Users.find({username: username});
}

// const signUp = (info, callback) => {
//   let 
// }


module.exports = {
  saveUserInit,
  getUserId,
  saveJob,
  checkLogin
};