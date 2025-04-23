/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(route: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return `http://localhost:${port}${route}`;
  }

  return `file://${path.resolve(__dirname, '../renderer/index.html', route)}`;
}
