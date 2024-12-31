export const SERVER_CONFIG = {
  port: process.env.PORT || 3000,
  dev: process.env.NODE_ENV !== 'production',
  maxReconnectAttempts: 5,
  reconnectTimeout: 1000,
} as const;