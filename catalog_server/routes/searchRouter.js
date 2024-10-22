const express = require('express');
const router = express.Router();
const infoCont = require('../controllers/infoController');
const searchCont = require('../controllers/searchController');

router.get('/search/:topic',searchCont );

module.exports = router;