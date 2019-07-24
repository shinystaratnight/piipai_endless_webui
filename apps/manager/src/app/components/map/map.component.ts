import { Component, OnInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { MapService, Marker } from './map.service';

import { FilterService } from '../../dynamic-form/services/filter.service';
import { MetadataService } from '@webui/metadata';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('filterBlock', { static: false }) public elementRef: ElementRef;

  public config: {
    list: string;
    filters?: any[];
  };

  public filtersOfList: any[];
  public markers: Marker[];

  public currentPosition: any;
  public currentQuery: string;
  public filterBlockHidden = true;
  public preloader: boolean;

  public icons: any;
  public types: string[];

  public defaultLatitude = -33.865143;
  public defaultlongitude = 151.209900;

  constructor(
    private mapService: MapService,
    private filterService: FilterService,
    private metadata: MetadataService
  ) { }

  public ngOnInit() {
    this.icons = {
      current: {
        exist: false,
        name: 'Your current position',
        path: '/assets/img/location-yellow.svg'
      },
      client: {
        exist: false,
        name: 'Clients',
        path: '/assets/img/location-orange.svg'
      },
      jobsite: {
        exist: false,
        name: 'Jobsites',
        path: '/assets/img/location-blue.svg'
      },
      client_hq: {
        exist: false,
        name: 'Primary Client addresses',
        path: '/assets/img/location-red.svg'
      },
      jobsite_open: {
        exist: false,
        name: 'Jobsites with Booking on "Open" state',
        path: '/assets/img/location-bluesky.svg'
      }
    };
    this.types = ['current', 'client_hq', 'jobsite', 'jobsite_open', 'client'];

    this.preloader = true;
    this.getCurrentPosition();
    this.config = {
      list: 'jobsitesMap',
    };

    this.metadata.get('/hr/jobsites/jobsite_map/', 'filters')
      .subscribe((filters) => {
        this.config.filters = filters;
      });

    this.filterService.filters = {
      endpoint: this.mapService.endpoint,
      list: this.config
    };
    this.filtersOfList = this.filterService.getFiltersByEndpoint(this.mapService.endpoint);
  }

  public ngOnDestroy() {
    this.filterService.filters = {
      endpoint: this.mapService.endpoint,
      list: null
    };
    this.filterService.resetQueries(this.config.list);
  }

  public getPositions(query: string =  '') {
    this.types.forEach((el) => {
      this.icons[el].exist = false;
    });

    this.mapService.getPositions(query)
      .subscribe((res: Marker[]) => {
        this.markers = res.map((el) => {
          el.latitude = parseFloat(<any> el.latitude);
          el.longitude = parseFloat(<any> el.longitude);
          this.icons[el.type].exist = true;
          return el;
        });

        this.currentQuery = query;
        if (this.currentPosition) {
          this.icons['current'].exist = true;
          this.markers.push(this.currentPosition);
        } else {
          this.icons['current'].exist = false;
        }
      });
  }

  public filterHandler(e) {
    if (e === 'resetAll') {
      if (this.currentQuery !== '') {
        this.preloader = true;
        this.markers = undefined;
        this.getPositions();

        this.filterService.resetFilters(this.config.list);
      }

    } else {
      const query = this.filterService.getQuery(e.list);

      if (this.currentQuery !== query) {
        this.preloader = true;
        this.markers = undefined;
        this.getPositions('?' + query);
      }
    }
  }

  public getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.currentPosition = pos.coords;
        this.currentPosition.type = 'current';

        this.getPositions();
      },
      (err) => this.getPositions()
  );
  }

  public trackByFn(index, item) {
    return item.latitude + item.longitude;
  }

  public mapReady(e) {
    this.preloader = false;
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;

        if (this.filterBlockHidden) {
          this.filterBlockHidden = false;
        }
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filterBlockHidden = true;
    }
  }
}
