import { INestApplication, LoggerService } from '@nestjs/common';

export function registerGracefulShutdown(
  app: INestApplication,
  logger: LoggerService,
  forceExitTimeout = 10_000,
  flushDelay = 100,
): void {
  let shuttingDown = false;
  const exitAfterFlush = (code: number) => {
    setTimeout(() => process.exit(code), flushDelay).unref();
  };

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    const timeout = setTimeout(() => {
      logger.error(`Graceful shutdown timed out (${signal}), forcing exit.`);
      exitAfterFlush(1);
    }, forceExitTimeout).unref();

    try {
      await app.close();
      clearTimeout(timeout);
      exitAfterFlush(0);
    } catch (err) {
      clearTimeout(timeout);
      logger.error(err, 'Shutdown error.');
      exitAfterFlush(1);
    }
  };

  const handler = (signal: string) => {
    void shutdown(signal);
  };

  process.on('SIGTERM', () => handler('SIGTERM'));
  process.on('SIGINT', () => handler('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error('uncaughtException:', error);
    exitAfterFlush(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', reason);
    exitAfterFlush(1);
  });
}
