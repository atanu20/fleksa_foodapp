const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../db/dbConnect');
const saltRounds = 10;
const Insta = require('instamojo-nodejs');
const bcrypt = require('bcrypt');
// SELECT * FROM foods INNER JOIN restaurant ON foods.res_id=restaurant.res_id WHERE foods.res_id='R6942'

const API_KEY = 'test_c06b46e28e2a2b035498f4721c5';

const AUTH_KEY = 'test_11139217a60baaae7ff95692cea';

Insta.setKeys(API_KEY, AUTH_KEY);
Insta.isSandboxMode(true);
const userCtrl = {
  register: async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const rand = Math.floor(Math.random() * 9000 + 1000);

      bcrypt.hash(password, saltRounds, (errr, hash) => {
        const data = {
          userid: `U${rand}`,
          name,
          email,
          password: hash,
        };
        if (errr) {
          return res.json({ success: false, msg: errr.message });
        } else {
          let sqll = `select * from user where email='${email}'`;
          db.query(sqll, (er, ress) => {
            if (ress?.length > 0) {
              return res.json({
                success: false,
                msg: 'Email Already Present',
              });
            } else {
              let sql = 'INSERT INTO `user` SET ?';
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
      const { email, password } = req.body;

      let sql = `select * from user where email='${email}'`;
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
                  id: result[0].userid,
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
            res.send({ success: false, msg: 'Email Does Not Exits' });
            // console.log("noo email ")
          }
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAllFoods: async (req, res) => {
    try {
      let sql = `select * from foods ORDER BY RAND()`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          // res.send({err:err})
          return res.send({ success: false, msg: err.message });
        } else {
          return res.send({ success: true, result });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getFavRestaurants: async (req, res) => {
    try {
      let sql = `SELECT * FROM foods INNER JOIN restaurant ON foods.res_id=restaurant.res_id ORDER BY RAND()`;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          // res.send({err:err})
          return res.send({ success: false, msg: err.message });
        } else {
          return res.send({ success: true, result });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  addwishlist: async (req, res) => {
    try {
      const user = req.user;
      const { restu_id, fo_id } = req.body;
      const data = {
        restu_id,
        fo_id,
        u_id: user.id,
      };

      let sqll = `select * from wishlist where restu_id='${restu_id}' and fo_id='${fo_id}'`;

      db.query(sqll, (err, resul) => {
        if (err) {
          return res.send({ success: false, msg: err.message });
        } else {
          if (resul.length > 0) {
            return res.send({
              success: false,
              msg: 'Item already in your wishlist',
            });
          } else {
            let sql = 'INSERT INTO `wishlist` SET ?';
            db.query(sql, data, (err, result) => {
              if (err) {
                // console.log(err);
                return res.json({ success: false, msg: err.message });
              } else {
                return res.json({
                  success: true,
                  msg: 'Successfully Added',
                });
              }
            });
          }
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getallwishlist: async (req, res) => {
    try {
      const user = req.user;
      let sql = `SELECT * FROM wishlist INNER JOIN restaurant ON wishlist.restu_id=restaurant.res_id INNER JOIN foods ON wishlist.fo_id=foods.food_id  where wishlist.u_id='${user.id}' order by wish_id desc `;
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
  getFoodById: async (req, res) => {
    try {
      const fid = req.params.fid;
      let sql = `SELECT * FROM foods INNER JOIN restaurant ON foods.res_id=restaurant.res_id where foods.food_id='${fid}'`;
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
  getCartDetails: async (req, res) => {
    try {
      const arrid = req.body.ids;
      let sql = `SELECT * FROM foods INNER JOIN restaurant ON foods.res_id=restaurant.res_id where foods.food_id in (${arrid})`;
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
  addUserAddress: async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const data = { name, phone, address, user_id: req.user.id };
      let sql = 'INSERT INTO `address` SET ?';
      db.query(sql, data, (err, result) => {
        if (err) {
          // console.log(err);
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({
            success: true,
            msg: 'Address Added Successfully',
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getUserAddress: async (req, res) => {
    try {
      let sql = `select * from address where user_id='${req.user.id}' order by add_id desc`;
      db.query(sql, (err, result) => {
        if (err) {
          // console.log(err);
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
  buynow: async (req, res) => {
    try {
      const {
        totalprice,
        paymentmode,
        paymentemail,
        addressid,
        products,
        cart,
      } = req.body;
      const user = req.user;

      var insta = new Insta.PaymentData();

      const REDIRECT_URL = 'https://fleksa-client.vercel.app/success';
      // const REDIRECT_URL = 'http://localhost:4551/success';

      insta.setRedirectUrl(REDIRECT_URL);
      insta.send_email = 'True';
      insta.send_sms = 'False';
      insta.purpose = 'Fleksa Food'; // REQUIRED
      insta.amount = totalprice;
      insta.name = 'user';
      insta.email = paymentemail; // REQUIRED

      Insta.createPayment(insta, async (error, response) => {
        if (error) {
          return res.json({ success: false, msg: error.message });
        } else {
          const responseData = JSON.parse(response);
          //  const redirectUrl = responseData.payment_request.longurl;

          const data = {
            user_id: user.id,
            totalamount: totalprice,
            orderstatus: 'order placed',
            paymentstatus: 'inprogress',
            paymentid: responseData.payment_request.id,
            address_id: addressid,
          };

          let sql = 'INSERT INTO `orders` SET ?';
          db.query(sql, data, async (err, result) => {
            if (err) {
              // console.log(err);
              return res.json({ success: false, msg: err.message });
            } else {
              for (let i = 0; i < products.length; i++) {
                const indata = {
                  order_id: result.insertId,
                  foodid: products[i].food_id,
                  foodqty: cart.items[products[i].food_id],
                  foodprice: products[i].price,
                  rating: 0,
                };
                let sqll = 'INSERT INTO `orderdetails` SET ?';
                db.query(sqll, indata, async (err, resul) => {
                  if (err) {
                    // console.log(err);
                    return res.json({ success: false, msg: err.message });
                  } else {
                    return res.json({
                      success: true,
                      result: responseData,
                    });
                  }
                });
              }
            }
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  paymentProcess: async (req, res) => {
    try {
      const pid = req.params.pid;
      let sql = `update orders set paymentstatus="done" where paymentid='${pid}'`;
      db.query(sql, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          return res.json({ success: true, msg: 'Done' });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAllOrdersById: async (req, res) => {
    try {
      const user = req.user;
      let sql = `SELECT * FROM orders INNER JOIN address ON orders.address_id=address.add_id where orders.user_id='${user.id}' and orders.paymentstatus!="inprogress" order by odate desc`;
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
  getAllOrdersDetByOId: async (req, res) => {
    try {
      const oid = req.params.oid;
      let sql = `SELECT * FROM orderdetails INNER JOIN foods ON orderdetails.foodid=foods.food_id where orderdetails.order_id='${oid}'`;
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
  getUserDetByAddId: async (req, res) => {
    try {
      const addid = req.params.addid;
      let sql = `SELECT * FROM address where add_id='${addid}'`;
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

  addrating: async (req, res) => {
    try {
      const { ra_id, fo_id, rat_val, ord_id, odd_id } = req.body;

      const data = {
        ra_id,
        fo_id,
        us_id: req.user.id,
        rat_val,
        ord_id,
        odd_id,
      };

      let sqll = `update orderdetails set rating='${rat_val}' where od_id='${odd_id}'`;
      db.query(sqll, (err, result) => {
        if (err) {
          return res.json({ success: false, msg: err.message });
        } else {
          let sql = 'INSERT INTO `rating` SET ?';
          db.query(sql, data, (err, result) => {
            if (err) {
              // console.log(err);
              return res.json({ success: false, msg: err.message });
            } else {
              return res.json({
                success: true,
                msg: 'Rating Added Successfully',
              });
            }
          });
        }
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getratingbyFoodid: async (req, res) => {
    try {
      const fid = req.params.fid;
      // console.log(fid);
      let sql = `SELECT AVG(rat_val) as rating_val FROM rating where fo_id='${fid}' GROUP BY fo_id`;
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

module.exports = userCtrl;
