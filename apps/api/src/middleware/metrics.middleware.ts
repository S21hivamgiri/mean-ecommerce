import {
  httpRequests,
  httpErrors,
  httpDuration,
} from '@myCommerce/observability';

import type { Request, Response, NextFunction } from 'express';

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;

    const route = req.route?.path ?? req.path;

    const attributes = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequests.add(1, attributes);

    httpDuration.record(duration, attributes);

    if (res.statusCode >= 500) {
      httpErrors.add(1, attributes);
    }
  });

  next();
}
