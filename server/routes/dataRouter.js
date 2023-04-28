const express = require('express')

const DataCtrl = require('../controllers/dataController')

const router = express.Router()

router.post('/getDataOfPlant', DataCtrl.getDataOfPlant)
router.post('/getDataOfSensor', DataCtrl.getDataOfSensor)
router.post('/clearData', DataCtrl.clearData)

module.exports = router