const express = require('express');
const verifyFirebaseToken = require('../middlewares/auth');
const { authentificateUser, refreshUser, addMobil, addCard, selectPaymentMethod, removeMobil, removeCard, addCoins } = require('../controllers/auth');

const router = express.Router();

router.post('/authentificate', verifyFirebaseToken, authentificateUser);
router.post('/refresh', verifyFirebaseToken, refreshUser);

router.post('/add-mobil', verifyFirebaseToken, addMobil);
router.post('/add-card', verifyFirebaseToken, addCard);
router.post('/select-payement-method', verifyFirebaseToken, selectPaymentMethod);

router.post('/remove-mobil', verifyFirebaseToken, removeMobil);
router.post('/remove-card', verifyFirebaseToken, removeCard);

router.post('/add-coins', verifyFirebaseToken, addCoins);

module.exports = router;

