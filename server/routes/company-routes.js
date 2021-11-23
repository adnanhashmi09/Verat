const router = require('express').Router();
const companyControls = require('../controllers/company-controls');
const upload = require('../db/multer-config').multConfig('companies', 'logo');
const getData = require('../db/multer-config').getData();

router.post('/register', upload, companyControls.register);

router.post('/enroll', getData, companyControls.enroll);

router.get('/details', companyControls.fetchDetails);

router.get('/employees', companyControls.employees);

router.post('/empdata', companyControls.fetchEmployee);

router.post('/profdata', companyControls.fetchProf);

module.exports = router;
