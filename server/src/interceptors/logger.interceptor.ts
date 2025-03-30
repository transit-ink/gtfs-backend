import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log({
      message: 'Incoming Request',
      method,
      url,
      body,
      query,
      params,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful response
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log({
            message: 'Request Completed',
            method,
            url,
            statusCode: context.switchToHttp().getResponse().statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          // Log error
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.error({
            message: 'Request Failed',
            method,
            url,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
      }),
      catchError((error) => {
        // Re-throw the error to maintain the error flow
        return throwError(() => error);
      }),
    );
  }
}
