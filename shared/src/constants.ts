export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  ANALYTICS: '/api/analytics',
  USERS: '/api/users',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  FORM_SUBMIT: 'form_submit',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
} as const;