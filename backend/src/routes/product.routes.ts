import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.js';
import { listProductsQuerySchema } from '../validators/product.validator.js';
import { idParamSchema, slugParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', validate(listProductsQuerySchema, 'query'), ProductController.listProducts);
router.get('/search/suggestions', ProductController.getSearchSuggestions);
router.get('/slug/:slug', validate(slugParamSchema, 'params'), ProductController.getProductBySlug);
router.get('/:id', validate(idParamSchema, 'params'), ProductController.getProductById);
router.get('/:id/related', validate(idParamSchema, 'params'), ProductController.getRelatedProducts);

export const productRoutes = router;
