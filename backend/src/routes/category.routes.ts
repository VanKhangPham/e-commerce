import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { validate } from '../middlewares/validate.js';
import { slugParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:slug', validate(slugParamSchema, 'params'), CategoryController.getCategoryBySlug);

export const categoryRoutes = router;
