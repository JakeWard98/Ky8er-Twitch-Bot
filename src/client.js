import tmi from 'tmi.js';
import { config } from './config.js';
import { logger } from './logger.js';

export function createClient() {
  const client = new tmi.Client({
    options: { debug: false, skipUpdatingEmotesets: true },
    connection: {
      reconnect: true,
      secure: true,
      maxReconnectAttempts: Infinity,
      reconnectDecay: 1.5,
      reconnectInterval: 2000,
    },
    identity: {
      username: config.botUsername,
      password: config.oauthToken,
    },
    channels: [config.channel],
  });

  client.on('connected', (addr, port) => {
    logger.info({ addr, port, channel: config.channel }, 'connected to Twitch');
  });

  client.on('disconnected', (reason) => {
    logger.warn({ reason }, 'disconnected from Twitch');
  });

  client.on('reconnect', () => {
    logger.info('attempting to reconnect');
  });

  client.on('notice', (_channel, msgid, message) => {
    logger.info({ msgid, message }, 'twitch notice');
  });

  return client;
}
