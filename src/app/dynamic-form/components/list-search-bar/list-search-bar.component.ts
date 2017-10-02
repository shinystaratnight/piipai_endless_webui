import { Component } from '@angular/core';

@Component({
  selector: 'list-search-bar',
  templateUrl: 'list-search-bar.component.html'
})
export class ListSerachBarComponent {
  public searchValue: string;

  public search(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
