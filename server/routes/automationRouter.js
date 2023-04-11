const express = require('express')

const automationCtrl = require('../controllers/automationController');

const router = express.Router()

router.get('/getAllAutomations', automationCtrl.getAllAutomations);
router.post('/getAutomationById', automationCtrl.getAutomationById);
router.post('/createAutomation', automationCtrl.createAutomation);
router.post('/updateAutomation', automationCtrl.updateAutomation);
router.post('/deleteAutomation', automationCtrl.deleteAutomation);


module.exports = router;