const router = require('express').Router();
const restuCtrl = require('../controllers/restuCtrl');
const auth = require('../middleware/auth');

router.post('/register', restuCtrl.register);
router.post('/login', restuCtrl.login);
router.post('/postFoodsByResId', auth, restuCtrl.postFoodsByResId);
router.get('/getAllFoodsByResId', auth, restuCtrl.getAllFoodsByResId);
router.get('/deleteFoodsByResId/:fid', auth, restuCtrl.deleteFoodsByResId);
router.post('/getRestuORDER', auth, restuCtrl.getRestuORDER);

module.exports = router;
