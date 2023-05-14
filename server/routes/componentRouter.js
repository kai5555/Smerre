const express = require('express')

const ComponentCtrl = require('../controllers/componentController');

const router = express.Router()

router.get('/getAllActors', ComponentCtrl.getAllActors);
router.get('/getAllSensors', ComponentCtrl.getAllSensors);
router.get('/getGeneralActors', ComponentCtrl.getGeneralActors);
router.get('/getGeneralSensors', ComponentCtrl.getGeneralSensors);

module.exports = router;