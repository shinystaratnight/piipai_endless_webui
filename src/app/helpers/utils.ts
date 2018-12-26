import { LocalStorageService } from 'ngx-webstorage';

const storage = new LocalStorageService();

export function getContactAvatar(name): string {
  const nameElements = name.split(' ');

  if (nameElements && nameElements.length) {
    if (nameElements.length === 2) {
      return nameElements.map((el) => el[0]).join('').toUpperCase();
    } else if (nameElements.length > 2) {
      nameElements.shift();
      return nameElements.map((el) => el[0]).join('').toUpperCase();
    }
  }
}

export function isMobile(): boolean {
  const deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return deviceNamesReg.test(navigator.userAgent.toLowerCase());
}

export function isCandidate(): boolean {
  const role = storage.retrieve('role');

  return role.__str__.includes('candidate');
}
