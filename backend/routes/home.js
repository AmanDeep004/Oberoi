const express = require('express');
const controller = require('../controllers/homeController');

const router = express.Router();

router.get('/', controller.Home);
// router.get('/getRoomData/:hotelId', controller.GetData);

router.post('/uploadImage', controller.UploadImage);

router.post('/bookAVenue', controller.BookAVenue);

module.exports = router;