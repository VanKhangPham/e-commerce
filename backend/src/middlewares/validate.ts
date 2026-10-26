import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

export const validate = (
  schema: AnyZodObject | ZodEffects<AnyZodObject>,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
