import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

export default abstract class Controller {

  constructor() {
    console.log('Controller initialized');

  }

  protected sendResponse(
    res: Response,
    { status = 200, success = true, message = '', data = null }: Partial<ApiResponse>
  ): Response {
    return res.status(status).json({
      success,
      message,
      ...(data && { data })
    });
  }

  protected success(res: Response, data?: any, message: string = 'Success'): Response {
    return this.sendResponse(res, {
      status: 200,
      success: true,
      message,
      data
    });
  }

  protected created(res: Response, data?: any, message: string = 'Created'): Response {
    return this.sendResponse(res, {
      status: 201,
      success: true,
      message,
      data
    });
  }

  protected badRequest(res: Response, message: string = 'Bad Request'): Response {
    return this.sendResponse(res, {
      status: 400,
      success: false,
      message
    });
  }

  protected unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.sendResponse(res, {
      status: 401,
      success: false,
      message
    });
  }

  protected notFound(res: Response, message: string = 'Not Found'): Response {
    return this.sendResponse(res, {
      status: 404,
      success: false,
      message
    });
  }

  protected serverError(res: Response, error: any): Response {
    console.error('Server Error:', error);
    return this.sendResponse(res, {
      status: 500,
      success: false,
      message: 'Internal Server Error'
    });
  }
}