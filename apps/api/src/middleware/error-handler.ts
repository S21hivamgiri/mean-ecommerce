import type { NextFunction, Request, Response } from 'express';

import { createLogger } from '@myCommerce/logger';

const logger = createLogger('order-api');

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(
    {
      requestId: req.requestId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    },
    'Request failed',
  );

  res.status(500).json({
    message: 'Internal server error',
  });
}
