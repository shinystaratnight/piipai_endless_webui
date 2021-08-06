import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-image-list',
  templateUrl: './list-image-list.component.html',
  styleUrls: ['./list-image-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListImageListComponent implements OnInit {
  public config: any;
  public images: Array<{ preview: boolean; image: string }> = [];

  public preview: boolean;

  get hasOpenPreview() {
    return this.images.some((el) => el.preview);
  }

  ngOnInit() {
    console.log(this);

    this.images = this.config.value.map((el) => {
      return {
        preview: false,
        image: el.file
      };
    });
  }

  showPreview(index) {
    this.images[index].preview = true;
  }

  hidePreview(index) {
    this.images[index].preview = false;
  }
}
