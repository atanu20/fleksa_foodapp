const router = require('express').Router();
const restuCtrl = require('../controllers/restuCtrl');
const auth = require('../middleware/auth');

router.post('/register', restuCtrl.register);
router.post('/login', restuCtrl.login);
router.post('/postFoodsByResId', auth, restuCtrl.postFoodsByResId);
router.get('/getAllFoodsByResId', auth, restuCtrl.getAllFoodsByResId);
router.get('/deleteFoodsByResId/:fid', auth, restuCtrl.deleteFoodsByResId);
router.post('/getRestuORDER', auth, restuCtrl.getRestuORDER);
router.get('/getAllItemsByResId/:rid', restuCtrl.getAllItemsByResId);
router.get('/getRestuDetailsById/:rid', restuCtrl.getRestuDetailsById);
router.get('/getALlRestRating/:rid', restuCtrl.getALlRestRating);
module.exports = router;
