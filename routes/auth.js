const express = require('express');
const verifyFirebaseToken = require('../middlewares/auth');
const { authentificateUser, refreshUser, addMobil, addCard, selectPaymentMethod } = require('../controllers/auth');

const router = express.Router();

router.post('/authentificate', verifyFirebaseToken, authentificateUser);
router.post('/refresh', verifyFirebaseToken, refreshUser);

router.post('/add-mobil', verifyFirebaseToken, addMobil);
router.post('/add-card', verifyFirebaseToken, addCard);
router.post('/select-payement-method', verifyFirebaseToken, selectPaymentMethod);

module.exports = router;

