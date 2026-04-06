export function isBroadcaster(context) {
  return Boolean(context?.badges?.broadcaster);
}

export function isModerator(context) {
  return Boolean(context?.mod) || isBroadcaster(context);
}

export function hasPermission(context, level) {
  switch (level) {
    case 'everyone':
      return true;
    case 'mod':
      return isModerator(context);
    case 'broadcaster':
      return isBroadcaster(context);
    default:
      return false;
  }
}
