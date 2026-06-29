export function getMainAppUrl(): string {
  const env = process.env.NEXT_PUBLIC_MAIN_APP_URL;
  if (env) return env;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://main-founivo-page.vercel.app';
}
