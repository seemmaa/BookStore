const express = require('express');
const router = express.Router();
const infoCont = require('../controllers/infoController');
const searchCont = require('../controllers/searchController');

router.get('/info/:id',infoCont.getInfo);
router.put('/updateCount/:id', infoCont.updatedCount);
router.get('/search/:topic',searchCont.bookSearch );


module.exports = router;