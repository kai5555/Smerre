const express = require('express')

const UserCtrl = require('../controllers/userController');
const verifyJWT = require("../utils/verifyJWT");

const router = express.Router()

router.post("/register", UserCtrl.register);
router.post("/login", UserCtrl.login);
router.post("/isUserAuth", verifyJWT, UserCtrl.isUserAuth);
router.post("/:id/update", UserCtrl.updateUser);
router.post("/:id/delete", UserCtrl.deleteUser);
router.post("/verifyEmailUser", UserCtrl.verifyEmailUser);
router.post('/resend_email', UserCtrl.resend);

module.exports = router;