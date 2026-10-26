import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema } from '../validators/order.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createOrderSchema), OrderController.createOrder);
router.get('/', OrderController.getMyOrders);
router.get('/:id', validate(idParamSchema, 'params'), OrderController.getOrderDetail);
router.post('/:id/cancel', validate(idParamSchema, 'params'), OrderController.cancelOrder);

export const orderRoutes = router;
