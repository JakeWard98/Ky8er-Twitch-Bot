import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('loadConfig throws when required vars are missing', () => {
  assert.throws(() => loadConfig({}), /Missing required environment variable/);
});

test('loadConfig throws when OAUTH_TOKEN lacks oauth: prefix', () => {
  assert.throws(
    () =>
      loadConfig({
        BOT_USERNAME: 'bot',
        OAUTH_TOKEN: 'notaprefix',
        CHANNEL_NAME: 'chan',
      }),
    /must start with "oauth:"/,
  );
});

test('loadConfig rejects invalid channel names', () => {
  assert.throws(
    () =>
      loadConfig({
        BOT_USERNAME: 'bot',
        OAUTH_TOKEN: 'oauth:abc',
        CHANNEL_NAME: 'x',
      }),
    /not a valid Twitch username/,
  );
});

test('loadConfig returns frozen config with defaults', () => {
  const cfg = loadConfig({
    BOT_USERNAME: 'mybot',
    OAUTH_TOKEN: 'oauth:abc123',
    CHANNEL_NAME: '#SomeChannel',
  });
  assert.equal(cfg.botUsername, 'mybot');
  assert.equal(cfg.channel, 'SomeChannel');
  assert.equal(cfg.prefix, '!');
  assert.equal(cfg.logLevel, 'info');
  assert.equal(Object.isFrozen(cfg), true);
});
