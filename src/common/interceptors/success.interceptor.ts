import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  PaginatedSuccessResult,
  SingleSuccessResult,
} from '../response/success-response.format';
import { Request, Response } from 'express';
import { winstonLogger } from '../logging/set-winston.logger';
import { ResultFactory } from '../response/result.factory';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  private readonly logger = winstonLogger;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data: any) => this.bundleResponse(data, context)));
  }

  /**
   * HTTP 정상 응답에 대한 payload를 적당히 가공하여 반환하는 메소드
   * @param data 반환 데이터
   * @param ctx 컨텍스트
   */
  private bundleResponse(
    data: any,
    ctx: ExecutionContext,
  ): SingleSuccessResult<any> | PaginatedSuccessResult<any> {
    const host = ctx.switchToHttp();
    const request = host.getRequest<Request>();
    const response = host.getResponse<Response>();

    // 데이터가 페이지네이션 된 결과인 경우에는 statusCode만 분기하고 그대로 반환
    if (data instanceof PaginatedSuccessResult) {
      response.statusCode = data.items.length !== 0 ? 200 : 204;
      this.logSuccess(request, response);
      return data;
    }

    // 이외의 경우에는 단일 데이터 결과이기 때문에 null or undefined 체크만 하고 응답 형태로 가공하여 반환
    response.statusCode = data ? 200 : 204;
    this.logSuccess(request, response);
    return ResultFactory.getSingleSuccessResult(data);
  }

  // 성공 로그를 찍는 메소드
  private logSuccess(request: Request, response: Response): void {
    const logMessage = `[${request.method}] ${response.statusCode} ${request.originalUrl} ${request.ip}`;

    this.logger.log(logMessage);
  }
}
