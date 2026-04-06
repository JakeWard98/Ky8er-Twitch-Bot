import pino from 'pino';
import { config } from './config.js';

export const logger = pino({
  level: config.logLevel,
  redact: {
    paths: [
      'oauthToken',
      'OAUTH_TOKEN',
      '*.oauthToken',
      '*.OAUTH_TOKEN',
      'identity.password',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
