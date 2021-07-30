import { getTimeInstance, getTimeInstanceByTimezone } from '@webui/utilities';
import { Endpoints, Models } from '../enums';
import { Model } from './model';

export type Timesheet = {
  id: string;
  shift_started_at: string;
  shift_ended_at: string;
  break_started_at: string;
  break_ended_at: string;
  supervisor_signature: {
    origin: string;
    thumb: string;
  };
  evaluation: {
    evaluation_score: number;
  };
  timezone?: string;
  time_zone?: string;
};

export class TimesheetModel extends Model {
  readonly key = Models.Timesheet;
  readonly label = 'Timesheet';
  readonly endpoint = Endpoints.Timesheet;
  readonly data: Timesheet;
  readonly endpoints = {
    not_agree: `${Endpoints.Timesheet}{id}/not_agree/`,
    evaluate: `${Endpoints.Timesheet}{id}/evaluate/`,
    approve_by_signature: `${Endpoints}{id}/approve_by_signature/`
  };

  get totalTime() {
    if (!this.data) {
      return null;
    }

    const {
      timezone,
      time_zone,
      shift_started_at,
      shift_ended_at,
      break_started_at,
      break_ended_at
    } = this.data;
    const timeInstance = getTimeInstanceByTimezone(timezone || time_zone);
    const defaultTime = '0h 0min';

    if (!shift_ended_at) {
      return defaultTime;
    }

    let times = {
      shift_ended_at: timeInstance(shift_ended_at),
      shift_started_at: timeInstance(shift_started_at),
      break_started_at: null,
      break_ended_at: null
    };

    let breakTime = 0;

    if (times.shift_ended_at.isBefore(times.shift_started_at)) {
      return defaultTime;
    }

    if (break_ended_at && break_started_at) {
      times = {
        ...times,
        break_ended_at: timeInstance(break_ended_at),
        break_started_at: timeInstance(break_started_at)
      };

      if (
        times.break_started_at.isAfter(times.shift_ended_at) ||
        times.break_ended_at.isAfter(times.shift_ended_at) ||
        times.break_started_at.isBefore(times.shift_started_at) ||
        times.break_ended_at.isBefore(times.shift_started_at)
      ) {
        return defaultTime;
      }

      breakTime = times.break_ended_at.diff(times.break_started_at);
    }

    const workTime = times.shift_ended_at.diff(times.shift_started_at);
    const totalTime = timeInstance.duration(workTime - breakTime);

    return `${Math.floor(totalTime.asHours())}hr ${totalTime.minutes()}min`;
  }
}
