require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const auth = require('./middleware/auth');
const db = require('./db/dbConnect');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/user', require('./routes/userRouter'));
app.use('/api/v1/restaurant', require('./routes/restuRouter'));

app.get('/', async (req, res) => {
  res.send('Welcome to Fleksa');
});

app.get('/auth/isVerify', auth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(user.id);

    let sql = `select * from restaurant where res_id='${user.id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        res.send({ success: false, msg: 'something wrong' });
      } else {
        if (result.length > 0) {
          res.send({
            success: true,
            msg: 'done',
            role: 'restaurant',
            userInfo: result[0],
          });
        } else {
          //
          let sqll = `select * from user where userid='${user.id}'`;
          db.query(sqll, (err, resu) => {
            if (err) {
              res.send({ success: false, msg: 'something wrong' });
            } else {
              if (resu.length > 0) {
                res.send({
                  success: true,
                  msg: 'done',
                  role: 'user',
                  userInfo: resu[0],
                });
              } else {
                res.send({
                  success: false,
                  msg: 'something wrong',
                  userInfo: [],
                });
              }
            }
          });
        }
      }
    });
  } catch (err) {
    res.send({ success: false, msg: 'Something wrong' });
  }
});

// Connect to mongodb

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
//
