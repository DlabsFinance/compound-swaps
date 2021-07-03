export function isLinkExternal(href: string | undefined): boolean {
  return href !== undefined ? href.startsWith("http") : false;
}

export function formatAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  } else {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }
}

export function formatAmount(
  price: string | number = 0,
  decimalPoints: number = 5
): string {
  const typecastedPrice = Number(price);
  return Number(typecastedPrice.toFixed(decimalPoints)).toLocaleString();
}
