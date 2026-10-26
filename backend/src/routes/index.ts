import { Router } from 'express';
import { authRoutes, userRoutes } from './auth.routes.js';
import { productRoutes } from './product.routes.js';
import { categoryRoutes } from './category.routes.js';
import { cartRoutes, wishlistRoutes } from './cart.routes.js';
import { orderRoutes } from './order.routes.js';
import { couponRoutes } from './coupon.routes.js';
import { reviewRoutes } from './review.routes.js';
import { blogRoutes } from './blog.routes.js';
import { adminRoutes } from './admin.routes.js';
import { settingRoutes } from './setting.routes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'NOVA Commerce REST API',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/wishlist', wishlistRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/blog', blogRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/', settingRoutes);

export { apiRouter };
