import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import { validate } from '../middlewares/validate.js';
import { slugParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', BlogController.listPosts);
router.get('/:slug', validate(slugParamSchema, 'params'), BlogController.getPostBySlug);

export const blogRoutes = router;
