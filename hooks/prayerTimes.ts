import { useState, useEffect } from 'react';

export type PrayerTime = {
  label: string;
  value: string;
};

export type PrayerTimesData = {
  todayPrayerTimes: {
    times: PrayerTime[];
    hijriDate?: string;
    gregorianDate?: string;
  };
  monthlyPrayerTimes?: Array<{
    date: string;
    imsak: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    sunset: string;
    maghrib: string;
  }>;
};

// DMath utility functions
const DMath = {
  dtr: (d: number) => (d * Math.PI) / 180.0,
  rtd: (r: number) => (r * 180.0) / Math.PI,
  sin: (d: number) => Math.sin(DMath.dtr(d)),
  cos: (d: number) => Math.cos(DMath.dtr(d)),
  tan: (d: number) => Math.tan(DMath.dtr(d)),
  arcsin: (d: number) => DMath.rtd(Math.asin(d)),
  arccos: (d: number) => DMath.rtd(Math.acos(d)),
  arctan: (d: number) => DMath.rtd(Math.atan(d)),
  arccot: (x: number) => DMath.rtd(Math.atan(1 / x)),
  arctan2: (y: number, x: number) => DMath.rtd(Math.atan2(y, x)),
  fixAngle: (a: number) => DMath.fix(a, 360),
  fixHour: (a: number) => DMath.fix(a, 24),
  fix: (a: number, b: number) => {
    a = a - b * Math.floor(a / b);
    return a < 0 ? a + b : a;
  },
};

// Prayer times calculation
function PrayTimes(method = 'Jafari') {
  const timeNames = {
    imsak: 'Imsak',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    sunset: 'Sunset',
    maghrib: 'Maghrib',
  };

  const methods = {
    Jafari: { 
      name: 'Shia Ithna-Ashari, Leva Institute, Qum', 
      params: { fajr: 16, maghrib: 4, midnight: 'Jafari' } 
    },
  };

  const defaultParams = { maghrib: '0 min', midnight: 'Standard' };
  let calcMethod = method;
  const setting: any = { dhuhr: '0 min', highLats: 'NightMiddle' };
  const timeFormat = '12h';
  const timeSuffixes = ['AM', 'PM'];
  const invalidTime = '-----';
  const numIterations = 1;
  const offset: any = {};
  let lat: number, lng: number, elv: number, timeZone: number, jDate: number;

  // Initialize parameters
  for (let i in methods) {
    const params = (methods as any)[i].params;
    for (let j in defaultParams) {
      if (typeof params[j] === 'undefined') {
        params[j] = (defaultParams as any)[j];
      }
    }
  }

  const params = (methods as any)[calcMethod].params;
  for (let id in params) setting[id] = params[id];
  for (let i in timeNames) offset[i] = 0;

  return {
    getTimes: function (date: number[], coords: number[], timezone?: number, dst?: boolean | string, format?: string) {
      lat = 1 * coords[0];
      lng = 1 * coords[1];
      elv = coords[2] ? 1 * coords[2] : 0;
      timeZone = timezone !== undefined ? Number(timezone) : this.getTimeZone(date);
      if (typeof dst === 'undefined' || dst === 'auto') dst = this.getDst(date);
      timeZone = Number(timeZone) + (dst ? 1 : 0);
      jDate = this.julian(date[0], date[1], date[2]) - lng / (15 * 24);
      return this.computeTimes();
    },

    getFormattedTime: function (time: number, format?: string, suffixes?: string[]) {
      if (isNaN(time)) return invalidTime;
      if (format === 'Float') return time;
      suffixes = suffixes || timeSuffixes;
      time = DMath.fixHour(time + 0.5 / 60);
      const hours = Math.floor(time);
      const minutes = Math.floor((time - hours) * 60);
      const suffix = format === '12h' ? suffixes[hours < 12 ? 0 : 1] : '';
      const hour = format === '24h' ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);
      return `${hour}:${this.twoDigitsFormat(minutes)} ${suffix}`;
    },

    midDay: function (time: number) {
      const eqt = this.sunPosition(jDate + time).equation;
      return DMath.fixHour(12 - eqt);
    },

    sunAngleTime: function (angle: number, time: number, direction?: string) {
      const decl = this.sunPosition(jDate + time).declination;
      const noon = this.midDay(time);
      const t = (1 / 15) * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(lat)) / (DMath.cos(decl) * DMath.cos(lat)));
      return noon + (direction === 'ccw' ? -t : t);
    },

    sunPosition: function (jd: number) {
      const D = jd - 2451545.0;
      const g = DMath.fixAngle(357.529 + 0.98560028 * D);
      const q = DMath.fixAngle(280.459 + 0.98564736 * D);
      const L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g));
      const R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
      const e = 23.439 - 0.00000036 * D;
      const RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
      const eqt = q / 15 - DMath.fixHour(RA);
      const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));
      return { declination: decl, equation: eqt };
    },

    julian: function (year: number, month: number, day: number) {
      if (month <= 2) {
        year -= 1;
        month += 12;
      }
      const A = Math.floor(year / 100);
      const B = 2 - A + Math.floor(A / 4);
      return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    },

    computePrayerTimes: function (times: any) {
      times = this.dayPortion(times);
      const sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw');
      const sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
      const dhuhr = this.midDay(times.dhuhr);
      const maghrib = sunset + (15 / 60);
      const nightDuration = this.timeDiff(sunset, sunrise + 24);
      let fajr = sunrise - (nightDuration / 4);
      const maxFajrSunriseDiff = 100 / 60;
      if (sunrise - fajr > maxFajrSunriseDiff) {
        fajr = sunrise - maxFajrSunriseDiff;
      }
      const imsak = fajr - (15 / 60);
      return { imsak, fajr, sunrise, dhuhr, sunset, maghrib };
    },

    computeTimes: function () {
      let times = { imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12, sunset: 18, maghrib: 18 };
      for (let i = 1; i <= numIterations; i++) times = this.computePrayerTimes(times);
      times = this.adjustTimes(times);
      times = this.tuneTimes(times);
      return this.modifyFormats(times);
    },

    adjustTimes: function (times: any) {
      for (let i in times) times[i] = Number(times[i]) + timeZone - lng / 15;
      if (setting.highLats !== 'None') times = this.adjustHighLats(times);
      times.dhuhr = Number(times.dhuhr) + this.eval(setting.dhuhr) / 60;
      return times;
    },

    riseSetAngle: function () {
      const angle = 0.0347 * Math.sqrt(elv);
      return 0.833 + angle;
    },

    tuneTimes: function (times: any) {
      for (let i in times) times[i] = Number(times[i]) + Number(offset[i]) / 60;
      return times;
    },

    modifyFormats: function (times: any) {
      for (let i in times) times[i] = this.getFormattedTime(times[i], timeFormat);
      return times;
    },

    adjustHighLats: function (times: any) {
      const nightTime = this.timeDiff(times.sunset, times.sunrise);
      times.imsak = this.adjustHLTime(times.imsak, times.sunrise, 15, nightTime, 'ccw');
      times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.eval(setting.fajr), nightTime, 'ccw');
      times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(setting.maghrib), nightTime);
      return times;
    },

    adjustHLTime: function (time: number, base: number, angle: number, night: number, direction?: string) {
      const portion = this.nightPortion(angle, night);
      const timeDiff = direction === 'ccw' ? this.timeDiff(time, base) : this.timeDiff(base, time);
      if (isNaN(time) || timeDiff > portion) time = base + (direction === 'ccw' ? -portion : portion);
      return time;
    },

    nightPortion: function (angle: number, night: number) {
      let portion = 1 / 2;
      if (setting.highLats === 'AngleBased') portion = (1 / 60) * angle;
      if (setting.highLats === 'OneSeventh') portion = 1 / 7;
      return portion * night;
    },

    dayPortion: function (times: any) {
      for (let i in times) times[i] = Number(times[i]) / 24;
      return times;
    },

    getTimeZone: function (date: number[]) {
      const year = date[0];
      const t1 = this.gmtOffset([year, 0, 1]);
      const t2 = this.gmtOffset([year, 6, 1]);
      return Math.min(t1, t2);
    },

    getDst: function (date: number[]) {
      return this.gmtOffset(date) !== this.getTimeZone(date);
    },

    gmtOffset: function (date: number[]) {
      const localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
      const GMTString = localDate.toUTCString();
      const GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
      return (localDate.getTime() - GMTDate.getTime()) / (1000 * 60 * 60);
    },

    eval: function (str: string | number) {
      return Number((str + '').split(/[^0-9.+-]/)[0]);
    },

    timeDiff: function (time1: number, time2: number) {
      return DMath.fixHour(time2 - time1);
    },

    twoDigitsFormat: function (num: number) {
      return num < 10 ? '0' + num : num;
    },
  };
}

function getPrayerTimes(date: Date) {
  const coords = [49.123767, -122.795717, 0]; // Surrey, British Columbia
  const dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const prayTimes = PrayTimes('Jafari');
  const times = prayTimes.getTimes(dateArray, coords, undefined, undefined, '12h');
  return {
    ...times,
    date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
    timezone: 'America/Vancouver',
    fajrDelay: 0, // Updated to reflect no delay
  };
}

function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) throw new Error('Invalid time format: ' + timeStr);
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) throw new Error('Invalid time values: ' + timeStr);
  let totalHours = hours;
  if (period === 'PM' && hours !== 12) totalHours += 12;
  if (period === 'AM' && hours === 12) totalHours = 0;
  return totalHours * 60 + minutes;
}

function minutesToTime(minutes: number, force24Hour = false): string {
  if (isNaN(minutes)) throw new Error('Invalid minutes value: ' + minutes);
  if (minutes < 0) minutes += 24 * 60;
  if (minutes >= 24 * 60) minutes -= 24 * 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (force24Hour) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  } else {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }
}

// Hijri date conversion
function gregorianToHijri(gregorianDate: Date) {
  const date = new Date(gregorianDate);
  const adjustedDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
  
  const year = adjustedDate.getFullYear();
  const month = adjustedDate.getMonth() + 1;
  const day = adjustedDate.getDate();
  
  let jd;
  if (month <= 2) {
    const adjustedYear = year - 1;
    const adjustedMonth = month + 12;
    const a = Math.floor(adjustedYear / 100);
    const b = 2 - a + Math.floor(a / 4);
    jd = Math.floor(365.25 * (adjustedYear + 4716)) + Math.floor(30.6001 * (adjustedMonth + 1)) + day + b - 1524.5;
  } else {
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }
  
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  let hijriMonth = Math.floor((24 * l3) / 709);
  let hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;
  
  if (hijriDay <= 0) {
    hijriMonth = hijriMonth - 1;
    if (hijriMonth <= 0) {
      hijriMonth = 12;
    }
    hijriDay = 30 + hijriDay;
  }
  
  if (hijriDay > 30) {
    hijriDay = hijriDay - 30;
    hijriMonth = hijriMonth + 1;
    if (hijriMonth > 12) {
      hijriMonth = 1;
    }
  }
  
  if (hijriDay < 1) {
    hijriDay = 1;
  }
  
  return {
    day: Math.floor(hijriDay),
    month: hijriMonth,
    year: hijriYear
  };
}

function getHijriDate() {
  const today = new Date();
  const hijriDate = gregorianToHijri(today);
  
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah'
  ];
  
  return `${hijriDate.day} ${hijriMonths[hijriDate.month - 1]} ${hijriDate.year} AH`;
}

export async function init(): Promise<PrayerTimesData> {
  try {
    const today = new Date();
    const prayerTimes = getPrayerTimes(today);
    
    // Convert to the expected format
    const todayPrayerTimes = {
      times: [
        { label: 'Imsak', value: prayerTimes.imsak },
        { label: 'Fajr', value: prayerTimes.fajr },
        { label: 'Sunrise', value: prayerTimes.sunrise },
        { label: 'Dhuhr', value: prayerTimes.dhuhr },
        { label: 'Sunset', value: prayerTimes.sunset },
        { label: 'Maghrib', value: prayerTimes.maghrib },
      ],
      hijriDate: getHijriDate(),
      gregorianDate: today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    // Generate monthly prayer times
    const monthlyPrayerTimes = [];
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= Math.min(daysInMonth, 7); day++) { // Limit to 7 days for demo
      const date = new Date(year, month, day);
      const times = getPrayerTimes(date);
      monthlyPrayerTimes.push({
        date: `${day} ${date.toLocaleDateString('en-US', { month: 'short' })}`,
        imsak: times.imsak,
        fajr: times.fajr,
        sunrise: times.sunrise,
        dhuhr: times.dhuhr,
        sunset: times.sunset,
        maghrib: times.maghrib,
      });
    }

    return {
      todayPrayerTimes,
      monthlyPrayerTimes,
    };
  } catch (error) {
    console.error('Error initializing prayer times:', error);
    return {
      todayPrayerTimes: { times: [] },
      monthlyPrayerTimes: [],
    };
  }
}

export function getMonthlyPrayerTimes(month: number, year: number) {
  // Implementation for getting monthly prayer times
  return [];
}

let is24HourFormat = false;

export function toggleTimeFormat(): boolean {
  is24HourFormat = !is24HourFormat;
  return is24HourFormat;
}

export function updateTimeFormat(times: PrayerTime[]): PrayerTime[] {
  return times.map(time => ({
    ...time,
    value: convertTimeFormat(time.value)
  }));
}

function convertTimeFormat(timeStr: string): string {
  try {
    const minutes = timeToMinutes(timeStr);
    return minutesToTime(minutes, is24HourFormat);
  } catch (error) {
    return timeStr; // Return original if conversion fails
  }
}