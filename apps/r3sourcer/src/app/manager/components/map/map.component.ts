import { Component, OnInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { MapService, Marker } from './map.service';

import { FilterEvent, FilterService } from '@webui/dynamic-form';
import { MapInfoWindow } from '@angular/google-maps';

@Component({
  selector: 'webui-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('filterBlock') public elementRef!: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  public config!: {
    list: string;
    filters?: any[];
  };

  public options!: google.maps.MapOptions;

  public filtersOfList!: any[];
  public markers?: Marker[] = [];

  public currentPosition: any;
  public currentQuery!: string;
  public filterBlockHidden = true;
  public preloader!: boolean;

  public icons: any;
  public types!: string[];

  public defaultLatitude = -33.865143;
  public defaultlongitude = 151.2099;

  public center!: {
    lat: number,
    lng: number
  };

  public currentMarker?: Marker;

  constructor(private mapService: MapService, private filterService: FilterService) {}

  public ngOnInit() {
    this.icons = {
      current: {
        exist: false,
        name: 'Your current position',
        translateKey: 'current_position',
        path: '/assets/img/location-yellow.svg',
      },
      client: {
        exist: false,
        name: 'Clients',
        translateKey: 'client.label',
        path: '/assets/img/location-orange.svg',
      },
      jobsite: {
        exist: false,
        name: 'Jobsites',
        translateKey: 'jobsite.label',
        path: '/assets/img/location-blue.svg',
      },
      client_hq: {
        exist: false,
        name: 'Primary Client addresses',
        translateKey: 'primary_client.label',
        path: '/assets/img/location-red.svg',
      },
      jobsite_open: {
        exist: false,
        name: 'Jobsites with Booking on "Open" state',
        translateKey: '',
        path: '/assets/img/location-bluesky.svg',
      },
    };
    this.types = ['current', 'client_hq', 'jobsite', 'jobsite_open', 'client'];

    this.preloader = true;
    this.getCurrentPosition();
    this.config = {
      list: 'jobsitesMap',
    };

    this.config.filters = this.mapService.getFilters();

    this.filterService.filters = {
      endpoint: this.mapService.endpoint,
      list: this.config,
    };
    this.filtersOfList = this.filterService.getFiltersByEndpoint(this.mapService.endpoint);

    this.options = {
      zoom: 13,
    };
  }

  public ngOnDestroy() {
    this.filterService.filters = {
      endpoint: this.mapService.endpoint,
      list: null,
    };
    this.filterService.resetQueries(this.config.list);
  }

  public getPositions(query: string = '') {
    this.types.forEach((el) => {
      this.icons[el].exist = false;
    });

    this.mapService.getPositions(query).subscribe((res) => {
      this.markers = res.map((el: any) => {
        el.position = {
          lat: parseFloat(<any>el.latitude),
          lng: parseFloat(<any>el.longitude)
        }
        this.icons[el.type].exist = true;
        return el;
      });

      this.currentQuery = query;
      if (this.currentPosition) {
        this.icons['current'].exist = true;
        this.markers?.push(this.currentPosition);
      } else {
        this.icons['current'].exist = false;
      }
    });
  }

  public filterHandler(e: FilterEvent) {
    if (e.reset) {
      if (this.currentQuery !== '') {
        this.preloader = true;
        this.markers = undefined;
        this.getPositions();

        this.filterService.resetFilters(e.list);
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
      (err) => {
        this.currentPosition = {
          type: 'current',
          lat: this.defaultLatitude,
          lng: this.defaultlongitude
        }
        this.getPositions();
      }
    );
  }

  public trackByFn(index: number, item: any) {
    return item.latitude + item.longitude;
  }

  public mapReady() {
    this.preloader = false;
  }

  public openInfo(marker: Marker, anchor: any) {
    this.currentMarker = marker;
    this.infoWindow.open(anchor);
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;

        if (this.filterBlockHidden) {
          this.filterBlockHidden = false;
        }
      }
      clickedComponent = (clickedComponent as HTMLElement).parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filterBlockHidden = true;
    }
  }
}
