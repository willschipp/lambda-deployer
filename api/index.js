var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var router = express.Router();

router.use('/docker',require('./docker'));
router.use('/function',require('./function'));

module.exports = router;
