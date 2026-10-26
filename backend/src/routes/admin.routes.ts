import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';
import { validate } from '../middlewares/validate.js';
import { upload } from '../middlewares/upload.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { loginSchema } from '../validators/auth.validator.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';
import { createCouponSchema, updateCouponSchema } from '../validators/coupon.validator.js';
import { updateStoreSettingSchema } from '../validators/setting.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

// 1. Admin Authentication (Separate from customer login)
router.post('/auth/login', authLimiter, validate(loginSchema), AuthController.adminLogin);

// Protect all following routes with requireAuth & requireRole('ADMIN')
router.use(requireAuth, requireRole('ADMIN'));

// 2. Dashboard
router.get('/dashboard', AdminController.getDashboard);

// 3. Products
router.get('/products', AdminController.listProducts);
router.post('/products', validate(createProductSchema), AdminController.createProduct);
router.put('/products/:id', validate(idParamSchema, 'params'), validate(updateProductSchema), AdminController.updateProduct);
router.delete('/products/:id', validate(idParamSchema, 'params'), AdminController.deleteProduct);
router.post('/upload', upload.single('image'), AdminController.uploadImage);

// 4. Categories
router.get('/categories', AdminController.listCategories);
router.post('/categories', validate(createCategorySchema), AdminController.createCategory);
router.put('/categories/:id', validate(idParamSchema, 'params'), validate(updateCategorySchema), AdminController.updateCategory);
router.delete('/categories/:id', validate(idParamSchema, 'params'), AdminController.deleteCategory);

// 5. Orders
router.get('/orders', AdminController.listOrders);
router.get('/orders/:id', validate(idParamSchema, 'params'), AdminController.getOrderById);
router.patch('/orders/:id/status', validate(idParamSchema, 'params'), validate(updateOrderStatusSchema), AdminController.updateOrderStatus);

// 6. Customers
router.get('/customers', AdminController.listCustomers);
router.get('/customers/:id', validate(idParamSchema, 'params'), AdminController.getCustomerDetail);
router.patch('/customers/:id/toggle-block', validate(idParamSchema, 'params'), AdminController.toggleBlockCustomer);

// 7. Coupons
router.get('/coupons', AdminController.listCoupons);
router.post('/coupons', validate(createCouponSchema), AdminController.createCoupon);
router.put('/coupons/:id', validate(idParamSchema, 'params'), validate(updateCouponSchema), AdminController.updateCoupon);
router.delete('/coupons/:id', validate(idParamSchema, 'params'), AdminController.deleteCoupon);

// 8. Reviews
router.get('/reviews', AdminController.listReviews);
router.patch('/reviews/:id/approve', validate(idParamSchema, 'params'), AdminController.approveReview);
router.delete('/reviews/:id', validate(idParamSchema, 'params'), AdminController.deleteReview);

// 9. Store Settings
router.get('/settings', AdminController.getSettings);
router.put('/settings', validate(updateStoreSettingSchema), AdminController.updateSettings);

export const adminRoutes = router;
