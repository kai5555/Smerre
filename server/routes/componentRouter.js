const express = require('express')

const ComponentCtrl = require('../controllers/componentController');

const router = express.Router()

router.get('/getAllActors', ComponentCtrl.getAllActors);
router.get('/getAllSensors', ComponentCtrl.getAllSensors);


module.exports = router;