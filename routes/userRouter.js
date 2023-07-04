const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/getAllFoods', userCtrl.getAllFoods);
router.get('/getFavRestaurants', userCtrl.getFavRestaurants);
router.post('/addwishlist', auth, userCtrl.addwishlist);
router.get('/getallwishlist', auth, userCtrl.getallwishlist);
router.get('/getFoodById/:fid', userCtrl.getFoodById);
router.post('/getCartDetails', userCtrl.getCartDetails);
router.post('/addUserAddress', auth, userCtrl.addUserAddress);
router.get('/getUserAddress', auth, userCtrl.getUserAddress);
router.post('/buynow', auth, userCtrl.buynow);
router.get('/success/:pid', auth, userCtrl.paymentProcess);
router.get('/getAllOrdersById', auth, userCtrl.getAllOrdersById);
router.get('/getAllOrdersDetByOId/:oid', auth, userCtrl.getAllOrdersDetByOId);
router.get('/getUserDetByAddId/:addid', auth, userCtrl.getUserDetByAddId);
router.post('/addrating', auth, userCtrl.addrating);
router.get('/getratingbyFoodid/:fid', userCtrl.getratingbyFoodid);

module.exports = router;
