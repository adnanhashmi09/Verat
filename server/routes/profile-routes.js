const router = require('express').Router();
const profileControls = require('../controllers/profile-controls');
const upload = require('../db/multer-config').multConfig('profiles', 'photo');

router.post('/setup', upload, profileControls.setup);

router.post('/update', profileControls.update);

router.post('/approve', profileControls.approve);

router.get('/details', profileControls.fetchDetails);

module.exports = router;
