/**
 * Bad request errors (400)
 * Errors due to invalid client input
 */
export const _400 = {
  BAD_REQUEST: {
    code: "BAD_REQUEST",
    message: "The request is invalid",
  },
  INVALID_URL_FORMAT: {
    code: "INVALID_URL_FORMAT",
    message: "The provided URL is not valid",
  },
  INVALID_CUSTOM_ALIAS: {
    code: "INVALID_CUSTOM_ALIAS",
    message: "Custom alias contains invalid characters or exceeds length limit",
  },
  MISSING_REQUIRED_FIELD: {
    code: "MISSING_REQUIRED_FIELD",
    message: "A required field is missing from the request",
  },
  INVALID_DATE_FORMAT: {
    code: "INVALID_DATE_FORMAT",
    message: "Date format is invalid",
  },
  INVALID_PARAMETER: {
    code: "INVALID_PARAMETER",
    message: "One or more parameters are invalid",
  },
  INVALID_QR_CODE_OPTIONS: {
    code: "INVALID_QR_CODE_OPTIONS",
    message: "The QR code options are invalid",
  },
  MALFORMED_JSON: {
    code: "MALFORMED_JSON",
    message: "The JSON in the request is malformed",
  },
  INVALID_FILTER_CRITERIA: {
    code: "INVALID_FILTER_CRITERIA",
    message: "The filter criteria provided is invalid",
  },
  UNSUPPORTED_CONTENT_TYPE: {
    code: "UNSUPPORTED_CONTENT_TYPE",
    message: "The content type is not supported",
  },
  RATE_LIMIT_EXCEEDED: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests, please try again later",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "Email address already exists",
  },
};

/**
 * Unauthorized errors (401)
 * Errors due to authentication failures
 */
export const _401 = {
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Authentication is required to access this resource",
  },
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "The provided credentials are invalid",
  },
  INVALID_TOKEN: {
    code: "INVALID_TOKEN",
    message: "The provided authentication token is invalid or expired",
  },
  EXPIRED_TOKEN: {
    code: "EXPIRED_TOKEN",
    message: "The authentication token has expired",
  },
  MISSING_TOKEN: {
    code: "MISSING_TOKEN",
    message: "Authentication token is missing",
  },
  ACCOUNT_LOCKED: {
    code: "ACCOUNT_LOCKED",
    message: "Account has been locked due to multiple failed attempts",
  },
  ACCOUNT_INACTIVE: {
    code: "ACCOUNT_INACTIVE",
    message: "Account is inactive or has been suspended",
  },
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    message: "Email address has not been verified",
  },
  SESSION_EXPIRED: {
    code: "SESSION_EXPIRED",
    message: "Your session has expired, please log in again",
  },
};

/**
 * Server errors (500)
 * Errors due to server-side issues
 */
export const _500 = {
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred on the server",
  },
  DATABASE_ERROR: {
    code: "DATABASE_ERROR",
    message: "An error occurred while accessing the database",
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message: "The service is temporarily unavailable",
  },
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message: "A network error occurred while processing the request",
  },
  THIRD_PARTY_SERVICE_ERROR: {
    code: "THIRD_PARTY_SERVICE_ERROR",
    message: "An error occurred with a third-party service",
  },
  TIMEOUT: {
    code: "TIMEOUT",
    message: "The operation timed out",
  },
  DATA_PROCESSING_ERROR: {
    code: "DATA_PROCESSING_ERROR",
    message: "An error occurred while processing the data",
  },
  EMAIL_SENDING_FAILED: {
    code: "EMAIL_SENDING_FAILED",
    message: "Failed to send email",
  },
  CONFIGURATION_ERROR: {
    code: "CONFIGURATION_ERROR",
    message: "Server configuration error",
  },
  FILE_SYSTEM_ERROR: {
    code: "FILE_SYSTEM_ERROR",
    message: "An error occurred while accessing the file system",
  },
};


export const _404 = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
};
