// Per-(user, command) cooldown. In-memory; resets on restart.
const hits = new Map();

export function checkCooldown(userId, commandName, seconds) {
  const key = `${userId}:${commandName}`;
  const now = Date.now();
  const next = hits.get(key) || 0;
  if (now < next) {
    return { allowed: false, retryInMs: next - now };
  }
  hits.set(key, now + seconds * 1000);
  return { allowed: true, retryInMs: 0 };
}

// Occasional cleanup so the map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, expires] of hits) {
    if (expires < now) hits.delete(k);
  }
}, 60_000).unref();
