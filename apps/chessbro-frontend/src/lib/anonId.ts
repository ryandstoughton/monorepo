export function getOrCreateAnonId(): string {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('anon_id='));

  if (match) {
    return match.split('=')[1];
  }

  const id = crypto.randomUUID();
  const maxAge = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
  document.cookie = `anon_id=${id}; path=/; max-age=${maxAge}`;
  return id;
}
