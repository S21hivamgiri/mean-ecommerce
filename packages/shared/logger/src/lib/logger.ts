import pino from 'pino';
import { context, trace } from '@opentelemetry/api';

export function createLogger(serviceName: string) {
  const streams = [
    {
      stream: process.stdout,
    },
    {
      stream: pino.destination({
        dest: `logs/${serviceName}.log`,
        mkdir: true,
        sync: false,
      }),
    },
  ];

  return pino(
    {
      level: process.env.LOG_LEVEL || 'info',

      base: {
        service: serviceName,
        environment: process.env.NODE_ENV || 'development',
      },

      timestamp: pino.stdTimeFunctions.isoTime,

      mixin() {
        const span = trace.getSpan(context.active());

        if (!span) {
          return {};
        }

        const spanContext = span.spanContext();

        return {
          traceId: spanContext.traceId,
          spanId: spanContext.spanId,
          traceFlags: spanContext.traceFlags,
        };
      },
    },
    pino.multistream(streams),
  );
}
