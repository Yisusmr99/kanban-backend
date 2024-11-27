export class ResponseHelper {
    static success(message: string, data: any = null) {
      return {
        statusCode: 200,
        message,
        data,
      };
    }
  
    static error(message: string, error: string = null, statusCode: number = 400) {
      return {
        statusCode,
        message,
        error,
      };
    }
}  