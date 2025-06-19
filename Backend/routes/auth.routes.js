const { googleLogin } = require('../controllers/google.controller');

const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('Test Pass');
});

router.get('/google', googleLogin);

module.exports = router;
