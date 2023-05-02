const express = require('express')

const PlantCtrl = require('../controllers/plantController');

const router = express.Router()

router.get('/getAllPlants', PlantCtrl.getAllPlants);
router.post('/getPlantByName', PlantCtrl.getPlantByName);
router.post('/createPlant', PlantCtrl.createPlant);
router.post('/updatePlant', PlantCtrl.updatePlant);
router.post('/deletePlant', PlantCtrl.deletePlant);

module.exports = router;