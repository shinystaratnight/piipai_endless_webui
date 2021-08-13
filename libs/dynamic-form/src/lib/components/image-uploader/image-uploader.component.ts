import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscriber, combineLatest } from 'rxjs';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploaderComponent {
  @Input() source: Array<{ src: string; id: string }> = [];
  @Input() count: number = 2;
  @Input() loading: boolean;
  @Output() images: EventEmitter<string[]> = new EventEmitter();
  @Output() remove: EventEmitter<string> = new EventEmitter();

  fileChangeEvent(e) {
    const files: FileList = e.target.files;
    const observables = [];

    Array.from(files)
      .slice(0, this.count - this.source.length)
      .forEach((file: File) => {
        const reader = new FileReader();

        observables.push(
          new Observable((subscriber: Subscriber<string | ArrayBuffer>) => {
            reader.onload = () => {
              subscriber.next(reader.result);
              subscriber.complete();
            };
          })
        );

        reader.readAsDataURL(file);
      });

    combineLatest(observables).subscribe(
      (data: string[]) => {
        this.images.emit(data);
      },
      (err) => console.error('Image upload error')
    );
  }

  onRemove(id: string) {
    this.remove.emit(id);
  }
}
