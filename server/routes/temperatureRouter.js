const express = require('express')

const TemperatureCtrl = require('../controllers/temperatureController')

const router = express.Router()

router.post('/temperatures', TemperatureCtrl.createTemperature)
router.put('/temperatures/:id', TemperatureCtrl.updateTemperature)
router.delete('/temperatures/:id', TemperatureCtrl.deleteTemperature)
router.get('/temperatures/:id', TemperatureCtrl.getTemperatureById)
router.get('/temperatures', TemperatureCtrl.getTemperatures)

module.exports = router