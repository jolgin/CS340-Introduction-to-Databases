var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs340_olginj',
  password: '0008',
  database: 'cs340_olginj'
});

module.exports.pool = pool;