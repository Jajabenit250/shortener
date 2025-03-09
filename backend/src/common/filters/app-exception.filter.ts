import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { _500 } from '../constants/error.constant';

/**
 * Custom global exception filter that catches every thrown error.
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Response {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof HttpException) {
      const responseMsg = exception.getResponse();
      if (responseMsg['message'] && Array.isArray(responseMsg['message'])) {
        responseMsg['message'] = responseMsg['message'][0];
      }

      if (responseMsg['error']) {
        responseMsg['code'] = responseMsg['error']
          .split(' ')
          ?.join('_')
          ?.toUpperCase();
        delete responseMsg['error'];
      }
      delete responseMsg['statusCode'];
      return response.status(exception.getStatus()).json(responseMsg);
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(_500.INTERNAL_SERVER_ERROR);
  }
}
