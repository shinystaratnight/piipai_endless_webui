import { Role } from '../services';

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
  if (isTouchDevice) {
    return window.innerWidth < 768;
  }
}

export function isTouchDevice(): boolean {
  const deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return deviceNamesReg.test(navigator.userAgent.toLowerCase());
}

export function isCandidate(): boolean {
  const role: Role = JSON.parse(localStorage.getItem('web.role'));
  if (role) {
    return role.__str__.includes('candidate');
  }
}

export function isClient(): boolean {
  const role: Role = JSON.parse(localStorage.getItem('web.role'));
  if (role) {
    return role.__str__.includes('client');
  }
}

export function isManager(): boolean {
  const role: Role = JSON.parse(localStorage.getItem('web.role'));
  if (role) {
    return role.__str__.includes('manager');
  }
}

export function getRoleId(): string {
  const role: Role = JSON.parse(localStorage.getItem('web.role'));
  if (role) {
    return role.id;
  }
}

export function getTotalTime(time, data) {
    const shift_ended_at = time.instance(data.shift_ended_at);
    const shift_started_at = time.instance(data.shift_started_at);

    let breakTime = 0;

    if (data.break_ended_at && data.break_started_at) {
      const break_ended_at = time.instance(data.break_ended_at);
      const break_started_at = time.instance(data.break_started_at);

      breakTime = break_ended_at.diff(break_started_at);
    }

    const workTime = shift_ended_at.diff(shift_started_at);
    const totalTime = time.instance.duration(workTime - breakTime);

    return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
  }
