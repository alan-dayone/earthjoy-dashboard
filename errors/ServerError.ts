/* eslint-disable @typescript-eslint/no-explicit-any */
// Loopback 4 server error body. E.g:
// {
//   "error": {
//     "statusCode": 422,
//     "name": "UnprocessableEntityError",
//     "message": "The request body is invalid. See error object `details` property for more info.",
//     "code": "VALIDATION_FAILED",
//     "details": [
//       {
//         "path": "/email",
//         "code": "format",
//         "message": "should match format \"email\"",
//         "info": {
//           "format": "email"
//         }
//       }
//     ]
//   }
// }
interface ServerErrorBody {
  error: {
    statusCode?: string | number;
    name?: string;
    message?: string;
    code?: string;
    details?: any;
  };
}

export const getErrorCode = (error): string => {
  if (error.message === 'Network Error') {
    return 'networkError';
  }

  if (error.response?.data?.error) {
    const serverErrorBody = error.response?.data as ServerErrorBody;
    const key = serverErrorBody.error.message;

    if (/^\w+$/.test(key)) {
      return key;
    }

    return serverErrorBody.error.code;
  }

  return error.message;
};
