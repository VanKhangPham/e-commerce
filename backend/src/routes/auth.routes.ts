import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { upload } from '../middlewares/upload.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  addressSchema,
} from '../validators/auth.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

// Public Auth Endpoints
router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

export const authRoutes = router;

// User Profile & Address Endpoints
const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/profile', AuthController.getProfile);
userRouter.put('/profile', validate(updateProfileSchema), AuthController.updateProfile);
userRouter.put('/change-password', validate(changePasswordSchema), AuthController.changePassword);
userRouter.post('/avatar', upload.single('avatar'), AuthController.uploadAvatar);

// Address sub-routes
userRouter.get('/addresses', AuthController.getAddresses);
userRouter.post('/addresses', validate(addressSchema), AuthController.createAddress);
userRouter.put('/addresses/:id', validate(idParamSchema, 'params'), validate(addressSchema), AuthController.updateAddress);
userRouter.delete('/addresses/:id', validate(idParamSchema, 'params'), AuthController.deleteAddress);
userRouter.patch('/addresses/:id/default', validate(idParamSchema, 'params'), AuthController.setDefaultAddress);

export const userRoutes = userRouter;
