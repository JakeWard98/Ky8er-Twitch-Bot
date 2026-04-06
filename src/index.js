import { config } from './config.js';
import { logger } from './logger.js';
import { createClient } from './client.js';
import { commands } from './commands/index.js';
import { checkCooldown } from './middleware/cooldown.js';
import { hasPermission } from './middleware/permissions.js';

const client = createClient();

client.on('message', async (channel, context, message, self) => {
  if (self) return;
  if (!message.startsWith(config.prefix)) return;

  const raw = message.slice(config.prefix.length).trim();
  if (!raw) return;

  const [name, ...args] = raw.split(/\s+/);
  const command = commands.get(name.toLowerCase());
  if (!command) return;

  if (!hasPermission(context, command.permission)) {
    logger.debug({ user: context['user-id'], command: name }, 'permission denied');
    return;
  }

  const { allowed, retryInMs } = checkCooldown(
    context['user-id'],
    command.name,
    command.cooldown,
  );
  if (!allowed) {
    logger.debug({ user: context['user-id'], command: name, retryInMs }, 'cooldown active');
    return;
  }

  try {
    await command.handler(client, { channel, context, args, logger });
  } catch (err) {
    logger.error({ err, command: name }, 'command handler threw');
  }
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaught exception, exiting');
  process.exit(1);
});

async function shutdown(signal) {
  logger.info({ signal }, 'shutting down');
  try {
    await client.disconnect();
  } catch (err) {
    logger.error({ err }, 'error during disconnect');
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

client.connect().catch((err) => {
  logger.fatal({ err }, 'failed to connect to Twitch');
  process.exit(1);
});
