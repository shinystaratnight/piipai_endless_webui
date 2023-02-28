import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TimeSheet } from '@webui/data';
import { Icon } from '@webui/icon';
import { DATE_TIME_FORMAT, Time } from '@webui/time';
import { getContactAvatar } from '@webui/utilities';

@Component({
  selector: 'webui-timesheet-details-preview',
  templateUrl: './timesheet-details-preview.component.html',
  styleUrls: ['./timesheet-details-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetDetailsPreviewComponent {
  @Input() timeSheet!: TimeSheet;

  get avatar(): { src: string, preview: string } {
    const contact = this.timeSheet.candidate;

    return {
      src: contact.avatar.origin || '',
      preview: getContactAvatar(contact.__str__)
    }
  }

  public get info() {
    return [
      [
        {
          label: 'supervisor.label',
          icon: Icon.Person,
          text: this.timeSheet.candidate.fullName
        },
        {
          label: 'company',
          icon: Icon.Company,
          text: this.timeSheet.company.__str__
        },
        {
          label: 'shift.date.__str__.label',
          icon: Icon.Calendar,
          text: Time.parse(this.timeSheet.startedAt).format(DATE_TIME_FORMAT)
        }
      ],
      [
        {
          label: 'jobsite.label',
          icon: Icon.JobSite,
          text: this.timeSheet.jobSite.__str__
        },
        {
          label: 'position.label',
          icon: Icon.Position,
          text: this.timeSheet.position.__str__
        }
      ]
    ];
  }
}
