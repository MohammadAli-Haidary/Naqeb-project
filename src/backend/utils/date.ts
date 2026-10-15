/**
 * Imperial Technology - Jalali (Solar Hijri) Date Utilities
 * تبدیل تاریخ بین هجری شمسی و میلادی
 */

// ─── Jalali to Gregorian ───
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy: number, gm: number, gd: number;
  let days: number;

  jy += 1595;
  days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);

  gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }

  return [gy, gm, gd];
}

// ─── Gregorian to Jalali ───
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  let jy: number, jm: number, jd: number;
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];

  jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return [jy, jm, jd];
}

// ─── Get Today's Jalali Date ───
export function getTodayJalali(): string {
  const now = new Date();
  const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

// ─── Get Current Timestamp ───
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ─── Format Jalali Date ───
export function formatJalaliDate(dateStr: string): string {
  if (!dateStr) return '';
  // If already in Jalali format (YYYY/MM/DD)
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) return dateStr;
  // Convert from ISO
  const date = new Date(dateStr);
  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

// ─── Jalali Month Names ───
export const jalaliMonths = [
  'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله',
  'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'
];

// ─── Jalali Day Names ───
export const jalaliDays = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
];

// ─── Convert to Persian Digits ───
export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

// ─── Format Currency ───
export function formatCurrency(amount: number, symbol: string = '؋'): string {
  const formatted = Math.round(amount).toLocaleString('fa-AF');
  return `${formatted} ${symbol}`;
}

// ─── Parse Jalali Date to Timestamp ───
export function jalaliToTimestamp(jy: number, jm: number, jd: number): number {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd).getTime();
}

// ─── Get Days Between Two Jalali Dates ───
export function daysBetweenJalali(date1: string, date2: string): number {
  const parse = (d: string) => {
    const parts = d.split('/').map(Number);
    return jalaliToTimestamp(parts[0], parts[1], parts[2]);
  };
  return Math.abs(Math.round((parse(date1) - parse(date2)) / (1000 * 60 * 60 * 24)));
}

// ─── Add Days to Jalali Date ───
export function addDaysToJalali(dateStr: string, days: number): string {
  const parts = dateStr.split('/').map(Number);
  const [gy, gm, gd] = jalaliToGregorian(parts[0], parts[1], parts[2]);
  const newDate = new Date(gy, gm - 1, gd);
  newDate.setDate(newDate.getDate() + days);
  const [jy, jm, jd] = gregorianToJalali(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

// ─── Add Months to Jalali Date ───
export function addMonthsToJalali(dateStr: string, months: number): string {
  const parts = dateStr.split('/').map(Number);
  let jy = parts[0];
  let jm = parts[1] + months;
  let jd = parts[2];

  while (jm > 12) { jm -= 12; jy++; }
  while (jm < 1) { jm += 12; jy--; }

  // Clamp day to valid range
  const maxDay = jm <= 6 ? 31 : (jm <= 11 ? 30 : (isJalaliLeapYear(jy) ? 30 : 29));
  jd = Math.min(jd, maxDay);

  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

// ─── Check Jalali Leap Year ───
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jump = 0;
  for (let j = 1; j < breaks.length; j++) {
    const jm2 = breaks[j];
    jump = jm2 - jp;
    if (jy < jm2) break;
    jp = jm2;
  }
  let N = jy - jp;
  if (jump - N < 6) N = N - jump + ((jump + 4) / 33 | 0) * 33;
  let leap = ((N + 1) % 33 - 1) % 4;
  if (leap === -1) leap = 4;
  return leap === 0;
}
