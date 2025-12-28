const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.renderHomePage);
router.get('/year', controller.renderYearPage);
router.get('/week', controller.renderWeekPage);
router.get('/subjects/:code', controller.renderSubjectPage);
router.get('/test_schedule', controller.renderSchedulePage);
router.get('/library', controller.renderLibraryPage);
<<<<<<< HEAD
=======
router.get('/api/year', controller.redirectToYearPage);
>>>>>>> master

module.exports = router;