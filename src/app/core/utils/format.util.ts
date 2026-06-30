export function toArabicDigits(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  const str = String(text);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}
