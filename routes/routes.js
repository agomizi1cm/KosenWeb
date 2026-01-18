const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.renderHomePage);
router.get('/year', controller.renderYearPage);
router.get('/week', controller.renderWeekPage);
router.get('/api/week_list', controller.getWeekScheduleData);
router.get('/api/subject/:code', controller.getSubjectData);
router.get('/subject/:code', controller.renderSubjectPage);
router.get('/test_schedule', controller.renderSchedulePage);
router.get('/library', controller.redirectToLibraryPage);
router.get('/api/year', controller.redirectToYearSchedulePage);
router.get('/admin', controller.renderAdminPage);
router.post('/api/add_reschedule_class', controller.addRescheduleClass);
router.post('/api/delete_reschedule_class', controller.deleteRescheduleClass);

module.exports = router;