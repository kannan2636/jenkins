const express = require('express');
const v1PublicRoutes = require('./v1Public.router');

let router = express.Router();

//Routes
router.use('/v1/user',  v1PublicRoutes);

module.exports = router;