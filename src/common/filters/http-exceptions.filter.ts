import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { winstonLogger } from '../logging/set-winston.logger';
import { Response } from 'express';
import { ResultFactory } from '../response/result.factory';

/**
 * 비지니스 로직에서 발생하는 Http 에러들을 잡는 Exception Filter
 */
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = winstonLogger;

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.warn(exception.stack);

    response
      .status(status)
      .json(ResultFactory.getFailureResult(exception.message));
  }
}
