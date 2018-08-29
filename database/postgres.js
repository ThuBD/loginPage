const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const db = new Pool({
  host: 'localhost',
  database: 'appcounts',
  max: 100,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000
});

db.connect();

const saveUserInit = (info, callback) => {
  bcrypt.hash(info.password, 10, (err, res) => {
    const data = {};
    data.username = info.username;
    data.password = res;
    data.user_email = info.email;
    let current = new Date().toISOString();
    current = current.slice(0, 10) +  ' ' + current.slice(11);
    data.create_at = current;
    const query = `INSERT INTO users (username, password, user_email, created_at) VALUES('${data.username}', '${data.password}', '${data.user_email}', '${data.create_at}');`;
    db.query(query, callback);
  })
}

const updatePassword = (id, password, callback) => {
  bcrypt.hash(password, 10, (err, res) => {
    const query = `UPDATE users SET password = '${res}' where id = ${id}`;
    db.query(query, callback);
  })
}
// const saveJob = (username, details, callback) => {
//   let query = `INSERT INTO jobs (company_name, position, location, status) values ('${details.company}', '${details.position}', '${details.location}', '${details.status}'};`;
// }

const checkLogin = (identifier, password, callback) => {
  let query = `SELECT * FROM users where username = '${identifier}';`;
  db.query(query, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      console.log(data.rows[0])
      if (data.rowCount === 1) {
        bcrypt.compare(password, data.rows[0].password, (err2, res) => {
          if (err2) {
            callback(err2);
          } else {
            callback(null, res, data.rows[0]);
          }
        })
      } else {
        callback('User does not exist');
      }
    }
  });
}

const checkUsernameAvailability = (username, callback) => {
  let query = `SELECT * FROM users where username = '${username}';`;
  db.query(query, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      console.log(data.rows);
      if (data.rowCount > 0) {
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  })
}

const getAppliedCount = (id, callback) => {
  let query = `SELECT count(*) FROM jobs where user_id=${id}`;
  db.query(query, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      console.log(data.rows[0].count);
      callback(null, data.rows[0]);
    }
  })
}

const updateUsername = (id, username, callback) => {
  let query = `UPDATE users SET username = '${username}' where id = ${id};`;
  db.query(query, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      callback(null, data);
    }
  })
}

const checkEmailAvailability = (email, callback) => {
  let query = `SELECT count(*) FROM users where user_email = '${email}';`;
  db.query(query, callback);
}

const updateEmail = (id, email, callback) => {
  let query = `UPDATE users SET user_email = '${email}' where id = ${id};`;
  db.query(query, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      callback(null, data);
    }
  })
};

const updateAddress = (id, address, callback) => {
  let query = `UPDATE users SET user_address='${address}' where id = ${id};`;
  db.query(query, callback);
}

module.exports = {
  saveUserInit,
  checkLogin,
  checkUsernameAvailability,
  getAppliedCount,
  updateUsername,
  updatePassword,
  checkEmailAvailability,
  updateEmail,
  updateAddress
};