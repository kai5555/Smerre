const express = require('express')

const ComponentCtrl = require('../controllers/componentController');

const router = express.Router()

router.get('/getAllAutomations', ComponentCtrl.getAllAutomations);
router.post('/getAutomationById', ComponentCtrl.getAutomationById);
router.post('/createAutomation', ComponentCtrl.createAutomation);
router.post('/updateAutomation', ComponentCtrl.updateAutomation);
router.post('/deleteAutomation', ComponentCtrl.deleteAutomation);


module.exports = router;