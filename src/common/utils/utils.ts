export function validateKBONumber(number: string): boolean {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length === 10 && /^\d{10}$/.test(cleanNumber);
}

export function formatKBONumber(number: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `${cleanNumber.slice(0, 4)}.${cleanNumber.slice(4, 7)}.${cleanNumber.slice(7, 10)}`;
  }
  return number;
}