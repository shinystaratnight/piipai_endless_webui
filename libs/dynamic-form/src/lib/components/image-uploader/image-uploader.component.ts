import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscriber, combineLatest } from 'rxjs';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploaderComponent implements OnInit {
  @Input() source: string[] = [];
  @Input() count: number = 2;
  @Output() images: EventEmitter<string[]> = new EventEmitter();

  data: Set<string> = new Set();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(this);
    if (this.source.length) {
      this.source.forEach((src, i) => {
        this.data.add(src);
      });
    }
  }

  fileChangeEvent(e) {
    const files: FileList = e.target.files;
    const observables = [];

    Array.from(files).slice(0, this.count - this.source.length).forEach((file: File) => {
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
        data.forEach((src, i) => {
          this.data.add(src);
        });

        this.images.emit(data);
        this.cd.markForCheck();
      },
      err => console.error('Image upload error')
    );
  }
}
