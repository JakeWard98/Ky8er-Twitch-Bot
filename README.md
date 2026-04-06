# Ky8er Twitch Bot

A minimal, security-hardened Twitch chat bot built on [tmi.js](https://github.com/tmijs/tmi.js).

## Requirements

- Node.js **>= 20.0.0**
- A Twitch account for the bot
- An OAuth token (get one from <https://twitchapps.com/tmi/>)

## Setup

```bash
git clone https://github.com/JakeWard98/Ky8er-Twitch-Bot.git
cd Ky8er-Twitch-Bot
npm ci
cp .env.example .env
# Edit .env with your bot credentials
npm start
```

## Commands

| Command | Permission | Cooldown | Description            |
| ------- | ---------- | -------- | ---------------------- |
| `!dice` | everyone   | 2s       | Rolls a 6-sided die    |

## Architecture

```
src/
├── index.js           Entry point — env check, client bootstrap, signal handling
├── config.js          Env var validation (fail-fast)
├── logger.js          Pino structured logger with token redaction
├── client.js          tmi.js client + error/reconnect handlers
├── commands/
│   ├── index.js       Command registry
│   └── dice.js
└── middleware/
    ├── cooldown.js    Per-user command cooldown
    └── permissions.js Mod / broadcaster gating helpers
```

## Adding a command

1. Create `src/commands/<name>.js` exporting `{ name, cooldown, permission, handler }`.
2. Register it in `src/commands/index.js`.

The handler receives `(client, { channel, context, args, logger })`.

## Security

- Env vars validated at startup; bot exits with a clear error if credentials are missing.
- OAuth token redacted from all log output.
- Per-user cooldowns prevent exceeding Twitch's 20 msg / 30 s rate limit.
- CI runs `npm audit --audit-level=high`, ESLint, and tests on every PR.
- Dependabot weekly + CodeQL static analysis.
