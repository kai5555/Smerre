const express = require('express')

const AutomationCtrl = require('../controllers/automationController');

const router = express.Router()

router.get('/getAllAutomations', AutomationCtrl.getAllAutomations);
router.post('/getAutomationByName', AutomationCtrl.getAutomationByName);
router.post('/createAutomation', AutomationCtrl.createAutomation);
router.post('/updateAutomation', AutomationCtrl.updateAutomation);
router.post('/deleteAutomation', AutomationCtrl.deleteAutomation);
router.post('/toggleAutomation', AutomationCtrl.toggleAutomation);

module.exports = router;