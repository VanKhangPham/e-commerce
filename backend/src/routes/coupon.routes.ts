import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller.js';
import { validate } from '../middlewares/validate.js';
import { validateCouponSchema } from '../validators/coupon.validator.js';

const router = Router();

router.post('/validate', validate(validateCouponSchema), CouponController.validateCoupon);

export const couponRoutes = router;
