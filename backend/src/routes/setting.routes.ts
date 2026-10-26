import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { validate } from '../middlewares/validate.js';
import { contactMessageSchema, newsletterSchema } from '../validators/setting.validator.js';

const router = Router();

router.get('/settings', SettingController.getSettings);
router.post('/contact', validate(contactMessageSchema), SettingController.submitContact);
router.post('/newsletter', validate(newsletterSchema), SettingController.subscribeNewsletter);

export const settingRoutes = router;
