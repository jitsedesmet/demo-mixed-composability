import {page} from "$app/state";

export function alterQuery(key: string, value: string): string {
  const url = new URL(page.url);
  url.searchParams.set(key, value);
  return url.search;
}

export function getQueryParam(key: string): string | null {
  return page.url.searchParams.get(key);
}