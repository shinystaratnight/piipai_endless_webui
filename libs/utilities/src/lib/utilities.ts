import { MomentInput, Time } from '@webui/time';
import {CountryCodeLanguage, ITranslationPayload, Language, Role, Translation} from '@webui/models';

export enum DateRange {
  Year = 'year',
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

export const filterDateFormat = 'YYYY-MM-DD';

export const weekStart = 0;
export const weekEnd = 6;

export const rangeFormats = {
  [DateRange.Year]: 'YYYY',
  [DateRange.Month]: 'MMMM YYYY',
  [DateRange.Week]: 'MMM D',
  [DateRange.Day]: 'D MMMM YYYY',
};

export function getCurrentRole(): Role | undefined {
  const role = getLocalStorageItem('web.role');

  if (!role) {
    return;
  }

  return JSON.parse(role as string);
}

export function isCandidate(): boolean {
  const role = getCurrentRole();

  if (role) {
    return role.__str__.includes('candidate');
  }

  return false;
}

export function isClient(): boolean {
  const role = getCurrentRole();

  if (role) {
    return role.__str__.includes('client');
  }

  return false;
}

export function isManager(): boolean {
  const role = getCurrentRole();

  if (role) {
    return role.__str__.includes('manager') || role.__str__.includes('trial');
  }

  return false;
}

export function getRoleId(): string | undefined {
  const role = getCurrentRole();

  if (role) {
    return role.id;
  }

  return;
}

export function getContactAvatar(name: string): string {
  const nameElements = name.split(' ');

  if (nameElements && nameElements.length) {
    if (nameElements.length === 2) {
      return nameElements
        .map((el) => el[0])
        .join('')
        .toUpperCase();
    } else if (nameElements.length > 2) {
      nameElements.shift();
      return nameElements
        .map((el) => el[0])
        .join('')
        .toUpperCase();
    }
  }

  return '';
}

export function isTouchDevice(): boolean {
  const deviceNamesReg =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return deviceNamesReg.test(navigator.userAgent.toLowerCase());
}

export function isMobile(): boolean {
  if (isTouchDevice()) {
    return window.innerWidth < 768;
  }

  return false;
}

export function getStorageLang(): Language {
  const lang = getLocalStorageItem('web.lang');

  if (!lang) {
    return Language.English;
  }

  return JSON.parse(lang as string) as Language;
}

export function getTotalTime(data: Record<string, MomentInput>, timezone?: string) {
  const shift_ended_at = Time.parse(data['shift_ended_at'], { timezone });
  const shift_started_at = Time.parse(data['shift_started_at'], { timezone });

  let breakTime = 0;

  if (!data['shift_ended_at']) {
    return '0hr 0min';
  }

  if (shift_ended_at.isBefore(shift_started_at)) {
    return '0hr 0min';
  }

  if (data['break_ended_at'] && data['break_started_at']) {
    const break_ended_at = Time.parse(data['break_ended_at'], { timezone });
    const break_started_at = Time.parse(data['break_started_at'], { timezone });

    if (
      break_started_at.isAfter(shift_ended_at) ||
      break_ended_at.isAfter(shift_ended_at) ||
      break_started_at.isBefore(shift_started_at) ||
      break_ended_at.isBefore(shift_started_at)
    ) {
      return '0hr 0min';
    }

    breakTime = break_ended_at.diff(break_started_at);
  }

  const workTime = shift_ended_at.diff(shift_started_at);
  const totalTime = Time.duration(workTime - breakTime);

  return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
}

export function getPropValue(data: Record<string, unknown>, key: string): unknown | undefined {
  const props = key.split('.');
  const prop = props.shift();

  if (!prop) {
    return;
  }

  if (!props.length) {
    if (data) {
      return data[prop];
    }
  } else {
    if (data) {
      const newData = data[prop];

      if (Array.isArray(newData)) {
        return getPropValue(newData[0], props.join('.'));
      }

      return getPropValue(data[prop] as Record<string, unknown>, props.join('.'));
    }
  }

  return;
}

export function format(str: string, data: Record<string, unknown>) {
  const open = '{';
  const close = '}';
  const pieces = [];
  let before;
  let propValue;
  let pos = 0;
  let trail;
  while (true && str) {
    const start = str.indexOf(open, pos);
    const end = str.indexOf(close, pos);
    const key = str.substring(start + 1, end);
    if (start === -1 || end === -1) {
      trail = str.substr(pos);
      if (trail !== '') {
        pieces.push(trail);
      }
      break;
    }

    if (data) {
      const shift_started_at = Time.parse(data['shift_started_at'] as MomentInput, {
        timezone: data['timezone'] as string || data['time_zone'] as string || undefined,
      });

      if (key === 'shift_ended_at') {
        data['shift_ended_at'] = data['shift_ended_at'] || shift_started_at.clone().add(8, 'hour').add(30, 'minute').format();
      }

      if (key === 'break_started_at') {
        data['break_started_at'] = data['break_started_at'] || shift_started_at.clone().add(4, 'hour').format();
      }

      if (key === 'break_ended_at') {
        data['break_ended_at'] = data['break_ended_at'] || shift_started_at.clone().add(4, 'hour').add(30, 'minute').format();
      }
    }

    propValue = getPropValue(data, key);
    before = str.substring(pos, start);
    pieces.push(before);
    pieces.push(propValue);
    pos = end + 1;
  }
  return pieces.join('');
}

export class FormatString {
  static format = format;
  format = format;
}

export function getTranslationKey(key: string, type: string) {
  return `${key}.${type}`;
}

export function checkAndReturnTranslation(
  element: ITranslationPayload,
  countryCode: string,
  lang?: Language
): string {
  const { translations, translation, name } = element;
  const translationList =
    translations ||
    translation ||
    (name && typeof name !== 'string' && name.translations) ||
    [];

  if (!translationList.length) {
    return getDefaultValue(element);
  }

  const target = translationList.find((element: Translation) => {
    const { id } = element.language;
    const languageCode = lang || CountryCodeLanguage[countryCode as keyof typeof CountryCodeLanguage];

    return id === languageCode;
  });

  if (!target) {
    return getDefaultValue(element);
  }

  return target.value;
}

function getDefaultValue(element: {
  name?: { name: string; translations: Translation[] } | string;
  __str__?: string;
}): string {
  const { __str__, name } = element;

  if (typeof name === 'string') {
    return __str__ || name;
  }

  if (name) {
    return name.name;
  }

  return __str__ || '';
}

export function setPropValue(
  key: string,
  target: Record<string, unknown>,
  value: Record<string, unknown>
): void {
  const path = key.split('.');
  const prop = path.shift();

  if (!prop) {
    return;
  }

  if (!path.length) {
    target[prop] = value;
  } else {
    const newTaget = target[prop] as Record<string, unknown>;

    setPropValue(path.join('.'), newTaget, value);
  }
}

export function getFulfilledStatus(
  status: number,
  workers: { undefined: number; accepted: number; cancelled: number }
): number | undefined {
  if (status === 1) {
    return 1;
  }

  if (status === 0 && !workers.undefined) {
    return 0;
  }

  if (status === 0 && workers.undefined) {
    return 2;
  }

  return;
}

export function getLocalStorageItem(key: string): unknown | undefined {
  const value = localStorage.getItem(key);

  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return undefined;
}
