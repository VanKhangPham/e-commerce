import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { validate } from '../middlewares/validate.js';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

// Public: Get reviews of product
router.get('/product/:productId', ReviewController.getProductReviews);

// Authenticated user: CRUD on their reviews
router.post('/', requireAuth, validate(createReviewSchema), ReviewController.createReview);
router.put('/:id', requireAuth, validate(idParamSchema, 'params'), validate(updateReviewSchema), ReviewController.updateReview);
router.delete('/:id', requireAuth, validate(idParamSchema, 'params'), ReviewController.deleteReview);

export const reviewRoutes = router;
