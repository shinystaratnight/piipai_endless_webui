import { Role } from '@webui/data';

enum Language {
  English = 'en',
  Russian = 'ru',
  Estonian = 'et',
  Finnish = 'fi'
}

enum LanguageFullName {
  English = 'English',
  Russian = 'Russian',
  Estonian = 'Estonian',
  Finnish = 'Finnish'
}

enum CountryCodeLanguage {
  EE = Language.Estonian,
  FI = Language.Finnish
}

const translationCountryName = {
  EE: LanguageFullName.Estonian,
  FI: LanguageFullName.Finnish
};

export type Translation = {
  language: {
    id: Language;
    name: LanguageFullName;
  };
  value: string;
};

export enum DateRange {
  Year = 'year',
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

export const filterDateFormat = 'YYYY-MM-DD';

export const weekStart = 0;
export const weekEnd = 6;

export const rangeFormats = {
  [DateRange.Year]: 'YYYY',
  [DateRange.Month]: 'MMMM YYYY',
  [DateRange.Week]: 'MMM D',
  [DateRange.Day]: 'D MMMM YYYY'
};

export function getContactAvatar(name): string {
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
}

export function isTouchDevice(): boolean {
  const deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return deviceNamesReg.test(navigator.userAgent.toLowerCase());
}

export function getCurrentRole() {
  return JSON.parse(localStorage.getItem('web.role'));
}

export function isMobile(): boolean {
  if (isTouchDevice) {
    return window.innerWidth < 768;
  }
}

export function isCandidate(): boolean {
  const role: Role = getCurrentRole();
  if (role) {
    return role.__str__.includes('candidate');
  }
}

export function isClient(): boolean {
  const role: Role = getCurrentRole();
  if (role) {
    return role.__str__.includes('client');
  }
}

export function isManager(): boolean {
  const role: Role = getCurrentRole();
  if (role) {
    return role.__str__.includes('manager') || role.__str__.includes('trial');
  }
}

export function getRoleId(): string {
  const role: Role = getCurrentRole();
  if (role) {
    return role.id;
  }
}

export function getStorageLang(): Language {
  return JSON.parse(localStorage.getItem('web.lang'));
}

export function getTotalTime(time, data) {
  const shift_ended_at = time(data.shift_ended_at);
  const shift_started_at = time(data.shift_started_at);

  let breakTime = 0;

  if (!data.shift_ended_at) {
    return '0hr 0min';
  }

  if (shift_ended_at.isBefore(shift_started_at)) {
    return '0hr 0min';
  }

  if (data.break_ended_at && data.break_started_at) {
    const break_ended_at = time(data.break_ended_at);
    const break_started_at = time(data.break_started_at);

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
  const totalTime = time.duration(workTime - breakTime);

  return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
}

export function getPropValue(data, key: string): any {
  const props = key.split('.');
  const prop = props.shift();

  if (!props.length) {
    if (data) {
      return data[prop];
    }
  } else {
    if (data) {
      if (Array.isArray(data[prop])) {
        return getPropValue(data[prop][0], props.join('.'));
      }

      return getPropValue(data[prop], props.join('.'));
    }
  }
}

export function format(str, data) {
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

export function getTranslationKey(key, type) {
  if (!isManager()) {
    return `${key}.${type}`;
  }

  return 'without_translation';
}

export function checkAndReturnTranslation(
  element: {
    translations?: Translation[];
    translation?: Translation[];
    name?: { name: string; translations: Translation[] } | string;
    __str__?: string;
  },
  countryCode: string,
  lang?: Language
): string {
  const { translations, translation, name, __str__ } = element;
  const translationList =
    translations ||
    translation ||
    (name && typeof name !== 'string' && name.translations) ||
    [];

  if (!translationList.length) {
    return getDefaultValue(element);
  }

  const target: Translation = translationList.find((element: Translation) => {
    const { id } = element.language;
    const languageCode: Language = lang || CountryCodeLanguage[countryCode];

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
}) {
  const { __str__, name } = element;

  if (typeof name === 'string') {
    return __str__ || name;
  }

  if (name) {
    return name.name;
  }

  return __str__;
}

export function setPropValue(
  key: string,
  target: { [key: string]: any },
  value: any
): void {
  const path = key.split('.');
  const prop = path.shift();

  if (!path.length) {
    target[prop] = value;
  } else {
    setPropValue(path.join('.'), target[prop], value);
  }
}

export function getFulfilledStatus(
  status: number,
  workers: { undefined: number; accepted: number; cancelled: number }
) {
  if (status === 1) {
    return status;
  }

  if (status === 0 && !workers.undefined) {
    return 0;
  }

  if (status === 0 && workers.undefined) {
    return 2;
  }
}
