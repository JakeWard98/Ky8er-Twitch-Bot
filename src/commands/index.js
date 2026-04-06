import dice from './dice.js';

// Map<commandName, { name, cooldown, permission, handler }>
export const commands = new Map();

for (const cmd of [dice]) {
  commands.set(cmd.name, cmd);
}
