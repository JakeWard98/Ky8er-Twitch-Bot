import 'dotenv/config';

const REQUIRED = ['BOT_USERNAME', 'OAUTH_TOKEN', 'CHANNEL_NAME'];

function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((key) => !env[key] || env[key].trim() === '');
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in the values.',
    );
  }

  const oauth = env.OAUTH_TOKEN.trim();
  if (!oauth.startsWith('oauth:')) {
    throw new Error('OAUTH_TOKEN must start with "oauth:" (see https://twitchapps.com/tmi/)');
  }

  const channel = env.CHANNEL_NAME.trim().replace(/^#/, '');
  if (!/^[a-zA-Z0-9_]{4,25}$/.test(channel)) {
    throw new Error(`CHANNEL_NAME "${channel}" is not a valid Twitch username`);
  }

  return Object.freeze({
    botUsername: env.BOT_USERNAME.trim(),
    oauthToken: oauth,
    channel,
    prefix: (env.PREFIX || '!').trim(),
    logLevel: (env.LOG_LEVEL || 'info').trim(),
  });
}

export const config = loadConfig();
export { loadConfig };
