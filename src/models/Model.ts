import { Pool } from 'mysql2/promise';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export default abstract class Model {
  protected db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  protected formatResponse<T>(success: boolean, message: string, data?: T): ApiResponse<T> {
    return {
      status: success ? 'success' : 'error',
      message,
      ...(data && { data })
    };
  }

  protected async executeQuery<T>(query: string, params?: any[]): Promise<ApiResponse<T>> {
    try {
      const [result] = await this.db.execute(query, params);
      return this.formatResponse(true, 'Query executed successfully', result as T);
    } catch (error) {
      return this.formatResponse(false, (error as Error).message);
    }
  }
}