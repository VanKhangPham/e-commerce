import { Request, Response } from 'express';
import { SettingService } from '../services/setting.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class SettingController {
  static getSettings = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await SettingService.getSettings();
    return ApiResponse.success({
      res,
      data: settings,
    });
  });

  static submitContact = asyncHandler(async (req: Request, res: Response) => {
    const result = await SettingService.submitContact(req.body);
    return ApiResponse.created({
      res,
      message: result.message,
      data: result,
    });
  });

  static subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await SettingService.subscribeNewsletter(email);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });
}
