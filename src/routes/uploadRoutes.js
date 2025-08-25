const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadImage, uploadModel, getImage, getModel } = require('../controllers/uploadController');

router.post('/image', protect, uploadImage);
router.post('/model', protect, uploadModel);
router.get('/images/:restaurantId/:imageName', getImage);
router.get('/models/:restaurantId/:modelName', getModel);

module.exports = router;