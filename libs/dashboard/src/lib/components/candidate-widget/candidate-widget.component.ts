import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService, EventType } from '@webui/core';
import { candidatecontacts, fillin } from '@webui/manager-metadata';
import { FilterService } from '@webui/dynamic-form';
import { Endpoints } from '@webui/data';

import { DashboardService } from '../../services';

const enum Lists {
  CandidateContact = 'candidatecontact',
  Fillin = 'fillin'
}

@Component({
  selector: 'app-candidate-widget',
  templateUrl: './candidate-widget.component.html',
  styleUrls: ['./candidate-widget.component.scss'],
  providers: [FilterService]
})
export class CandidateWidget implements OnInit, OnDestroy {
  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };
  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public selectedCandidates: Set<string> = new Set();
  public offset = 0;
  public limit = 14;
  public loading = false;
  public filtersQuery = '';
  public activeList = Lists.CandidateContact;
  public statusColors = {
    0: 'danger',
    80: 'danger',
    90: 'danger'
  };
  public color_attr = 'number';

  public showFilters: boolean;
  public filtersOfList: any[];
  public count: number;
  public candidates: any[];
  public shift: any;
  private subscription: Subscription;

  candidateContactsConfig = {
    list: Lists.CandidateContact,
    filters: candidatecontacts.list.list.filters
  };

  fillinConfig = {
    list: Lists.Fillin,
    filters: fillin.list.list.filters.slice(1)
  };

  constructor(
    private widgetService: DashboardService,
    private eventService: EventService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.getCandidateContacts();
    this.subscribeEventChanges();
    this.initFilters();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

  public checkClass(item) {
    return this.statusColors[item[this.color_attr]] || '';
  }

  public selectCandidate(candidate) {
    if (this.shift) {
      candidate.selected = !candidate.selected;

      if (candidate.selected) {
        this.selectedCandidates.add(candidate.id);
      } else {
        this.selectedCandidates.delete(candidate.id);
      }
    }
  }

  public onModalScrollDown() {
    if (!this.loading && this.count > this.candidates.length) {
      this.offset += this.limit;
      this.loading = true;
      const queryObj = this.parseQuery(this.filtersQuery);

      this.getCandidateContacts({ offset: this.offset, ...queryObj }, true);
    }
  }

  public filterHandler(event) {
    if (event === 'resetAll') {
      this.filterService.resetFilters(this.activeList);
    }

    this.filtersQuery = this.filterService.getQuery(this.activeList);
  }

  public toggleFilters() {
    this.showFilters = !this.showFilters;

    if (!this.showFilters) {
      this.candidates = undefined;
      const queryObj = this.parseQuery(this.filtersQuery);

      if (this.activeList === Lists.CandidateContact) {
        this.offset = 0;
        this.getCandidateContacts(queryObj);
      } else {
        this.getFillinCandidates(queryObj);
      }
    }
  }

  public sendJobOffer() {
    const { job, shift } = this.shift;
    const candidates = Array.from(this.selectedCandidates.values());

    this.widgetService
      .sendJobOffers(job, shift.id, candidates)
      .subscribe(() => {
        this.changeList(Lists.CandidateContact, Endpoints.CandidateContact);
        this.candidates = undefined;
        this.selectedCandidates.clear();
        this.getCandidateContacts();
        this.eventService.emit(EventType.RefreshCalendar);
      });
  }

  public togglePanel(candidate, event) {
    event.stopPropagation();
    event.preventDefault();
    candidate.extend = !candidate.extend;

    return false;
  }

  private initFilters() {
    this.filterService.filters = {
      endpoint: Endpoints.CandidateContact,
      list: this.candidateContactsConfig
    };
    this.filterService.filters = {
      endpoint: 'fillin',
      list: this.fillinConfig
    };

    this.filtersOfList = this.filterService.getFiltersByEndpoint(
      Endpoints.CandidateContact
    );
  }

  private subscribeEventChanges() {
    this.subscription = this.eventService.event$.subscribe(type => {
      if (type === EventType.CalendarJobSelected) {
        this.offset = 0;
        this.shift = this.eventService.payload;
        this.candidates = undefined;
        this.selectedCandidates.clear();

        if (this.shift) {
          this.changeList(Lists.Fillin, Lists.Fillin);
          this.getFillinCandidates();
        } else {
          this.shift = undefined;
          this.changeList(Lists.CandidateContact, Endpoints.CandidateContact);
          this.getCandidateContacts();
        }
      }
    });
  }

  private getCandidateContacts(
    query: { [key: string]: any } = {},
    concat = false
  ) {
    this.widgetService
      .getCandidates({ limit: this.limit, ...query })
      .subscribe((data: { count: number; candidates: any[] }) => {
        if (concat) {
          this.candidates.push(...data.candidates);
          this.loading = false;
          return;
        }

        this.count = data.count;
        this.candidates = data.candidates;
      });
  }

  private getFillinCandidates(query: { [key: string]: any } = {}) {
    const { job, shift } = this.shift;

    this.widgetService
      .getFillinCandidates(job, {
        shifts: shift.id,
        ...query
      })
      .subscribe(candidates => {
        this.candidates = candidates;
      });
  }

  private parseQuery(query: string): { [key: string]: any } {
    const result = {};
    if (query.length) {
      query.split('&').forEach(el => {
        const parseEl = el.split('=');
        result[parseEl[0]] = parseEl[1];
      });
    }
    return result;
  }

  private changeList(list: Lists, endpoint: string) {
    this.activeList = list;
    this.filterService.resetFilters(list);
    this.filtersOfList = this.filterService.getFiltersByEndpoint(endpoint);
    this.showFilters = false;
    this.filtersQuery = '';
  }
}
