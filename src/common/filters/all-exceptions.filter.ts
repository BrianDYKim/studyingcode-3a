import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { winstonLogger } from '../logging/set-winston.logger';
import { Response } from 'express';
import { ResultFactory } from '../response/result.factory';

/**
 * 모든 에러를 잡아내서 처리하는 filter
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = winstonLogger;

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(exception.stack);

    response
      .status(status)
      .json(ResultFactory.getFailureResult(exception.message));
  }
}
