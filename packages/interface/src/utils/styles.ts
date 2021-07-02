export function isLinkExternal(href: string | undefined): boolean {
  return href !== undefined ? href.startsWith("http") : false;
}
