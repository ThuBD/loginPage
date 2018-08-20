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
    data.total_applied = 0;
    const query = `INSERT INTO users (username, password, user_email, created_at, total_applied) VALUES('${data.username}', '${data.password}', '${data.user_email}', '${data.create_at}', ${data.total_applied});`;
    db.query(query, callback);
  })
}

module.exports = {
  saveUserInit
};