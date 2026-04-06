export default {
  name: 'dice',
  cooldown: 2,
  permission: 'everyone',
  async handler(client, { channel, context, logger }) {
    const sides = 6;
    const roll = 1 + Math.floor(Math.random() * sides);
    await client.say(channel, `@${context['display-name']} rolled a ${roll}!`);
    logger.debug({ user: context['user-id'], roll }, 'dice command');
  },
};
