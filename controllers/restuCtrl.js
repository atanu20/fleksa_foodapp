const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../db/dbConnect');
const saltRounds = 10;
const bcrypt = require('bcrypt');

const restuCtrl = {
  register: async (req, res) => {
    try {
      const name = req.body.name;
      const phone = req.body.phone;
      const password = req.body.password;
      const address = req.body.address;
      const rand = Math.floor(Math.random() * 9000 + 1000);

      bcrypt.hash(password, saltRounds, (errr, hash) => {
        const data = {
          res_id: `R${rand}`,
          name,
          phone,
          address,
          password: hash,
        };
        if (errr) {
          return res.json({ success: false, msg: errr.message });
        } else {
          let sqll = `select * from restaurant where phone='${phone}'`;
          db.query(sqll, (er, ress) => {
            if (ress?.length > 0) {
              return res.json({
                success: false,
                msg: 'Phone Number Already Present',
              });
            } else {
              let sql = 'INSERT INTO `restaurant` SET ?';
              db.query(sql, data, (err, result) => {
                if (err) {
                  // console.log(err);
                  return res.json({ success: false, msg: err.message });
                } else {
                  return res.json({
                    success: true,
                    msg: 'Register Successfully Done',
                    result,
                  });
                }
              });
            }
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;

      let sql = `select * from restaurant where phone='${phone}'`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          // res.send({err:err})
          return res.send({ success: false, msg: err.message });
        } else {
          if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (errr, response) => {
              if (response) {
                const access_token = createAccessToken({
                  id: result[0].res_id,
                });

                res.json({
                  success: true,
                  access_token,
                  account: result[0],
                });
              } else {
                res.send({ success: false, msg: 'Wrong Password' });
              }
            });
          } else {
            res.send({ success: false, msg: 'Phone No Does Not Exits' });
            // console.log("noo email ")
          }
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAllFoodsByResId: async (req, res) => {
    try {
      const user = req.user;
      let sql = `select * from foods where res_id='${user.id}' ORDER BY fdate DESC`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            result,
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  postFoodsByResId: async (req, res) => {
    try {
      const user = req.user;

      const { title, price, image, tags, description } = req.body;

      const data = {
        res_id: user.id,
        title,
        price,
        image,
        tags,
        description,
        best: 0,
      };

      let sql = 'INSERT INTO `foods` SET ?';
      db.query(sql, data, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            msg: 'New Food Upload Done',
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  deleteFoodsByResId: async (req, res) => {
    try {
      const fid = req.params.fid;
      const user = req.user;
      let sql = `DELETE FROM foods where food_id='${fid}' and res_id='${user.id}'`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            msg: 'Delete Successfully Done',
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getRestuORDER: async (req, res) => {
    try {
      const list = req.body.list;
      let sql = `SELECT * FROM orderdetails INNER JOIN foods ON orderdetails.foodid=foods.food_id  INNER JOIN orders ON orderdetails.order_id=orders.ord_id where orderdetails.foodid in (${list}) and orders.paymentstatus!="inprogress"  order by orderdetails.od_id DESC `;
      // let sql = `SELECT * FROM foods where food_id in (${arrid}) `;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          return res.send({ success: false, msg: err.message });
        } else {
          return res.send({ success: true, result });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAllItemsByResId: async (req, res) => {
    try {
      const rid = req.params.rid;
      let sql = `SELECT * FROM foods INNER JOIN restaurant ON foods.res_id=restaurant.res_id where foods.res_id='${rid}' ORDER BY fdate DESC`;
      // let sql = `select * from foods where res_id='${rid}' ORDER BY fdate DESC`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            result,
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getRestuDetailsById: async (req, res) => {
    try {
      const rid = req.params.rid;
      let sql = `select * from restaurant where res_id='${rid}'`;
      db.query(sql, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            result,
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getALlRestRating: async (req, res) => {
    try {
      const rid = req.params.rid;

      let sql = `SELECT AVG(rat_val) as rating_val , COUNT(*) as totalreview FROM rating where ra_id='${rid}' GROUP BY ra_id`;
      db.query(sql, (err, result) => {
        if (err) {
          return res.send({ success: false, msg: err.message });
        } else {
          return res.send({ success: true, result });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '5m',
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '24h',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const removeTmp = (pat) => {
  fs.unlink(pat, (err) => {
    if (err) throw err;
  });
};

module.exports = restuCtrl;
