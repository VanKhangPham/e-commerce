import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { validate } from '../middlewares/validate.js';
import { addToCartSchema, updateCartItemSchema, addToWishlistSchema } from '../validators/cart.validator.js';

const router = Router();

router.use(requireAuth);

// Cart routes
router.get('/', CartController.getCart);
router.post('/', validate(addToCartSchema), CartController.addToCart);
router.put('/:itemId', validate(updateCartItemSchema), CartController.updateQuantity);
router.delete('/:itemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export const cartRoutes = router;

// Wishlist routes
const wishlistRouter = Router();
wishlistRouter.use(requireAuth);

wishlistRouter.get('/', CartController.getWishlist);
wishlistRouter.post('/', validate(addToWishlistSchema), CartController.addToWishlist);
wishlistRouter.delete('/:productId', CartController.removeFromWishlist);

export const wishlistRoutes = wishlistRouter;
