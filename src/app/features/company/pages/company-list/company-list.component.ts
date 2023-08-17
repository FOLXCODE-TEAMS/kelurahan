import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@features/company/interfaces/company.interface';
import { CompanyService } from '@features/company/services/company.services';
import {
  faChevronDown,
  faCog,
  faEye,
  faFilter,
  faLocationDot,
  faPlus,
  faRefresh,
  faSave,
  faSortAlphaUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();

  faPlus = faPlus;
  faTrash = faTrash;
  faSave = faSave;
  faEye = faEye;
  faCog = faCog;
  faChevronDown = faChevronDown;
  faFilter = faFilter;
  faSortAlphaUp = faSortAlphaUp;
  faRefresh = faRefresh;
  faLocationDot = faLocationDot;

  loading = false;
  companies: Company[] = [];

  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,

      route: ['/company/add'],
      action: () => {},
    },
  ];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.loadData();
      },
    },
    {
      label: '',
      icon: faFilter,

      action: () => {},
    },
  ];

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [
        { name: 'name', header: 'Name' },
        { name: 'note', header: 'Note' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private layoutService: LayoutService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Companies',
      icon: '',
      showHeader: true,
    });
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = params.page ? params.page : 1;
        this.rows = params.limit ? params.limit : 10;
        this.searchQuery = params.searchQuery ? params.searchQuery : '';
        this.layoutService.setSearchConfig({
          searchQuery: this.searchQuery,
          featureName: 'companies',
          baseHref: '/company/list',
        });
        if (params.order_by && params.direction) {
          this.fcFilterConfig.sort.selectedField = params.order_by;
          this.fcFilterConfig.sort.direction = params.direction;
        }
        this.fcFilterConfig.filterFields?.map((field: any) => {
          if (params[field.name]) {
            field.value = String(params[field.name]);
            if (field.type == 'object') {
              field.valueLabel = String(params[field.name + '-label']);
            }
          }
        });
      });
  }

  ngOnInit(): void {
    this.loadData();

    // load data when search
    this.layoutService.searchConfigSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.featureName == 'companies') {
          if (this.searchQuery != config.searchQuery) {
            this.searchQuery = config.searchQuery;
            this.loadData();
          }
        }
      });
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setParam() {
    let queryParams: any = {
      page: this.page,
      limit: this.rows,
    };
    if (this.searchQuery) {
      queryParams.searchQuery = this.searchQuery;
    }

    // end filter conditions
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
  }

  loadData(
    page: number = 0,
    searchQuery: string = this.searchQuery,
    filterObj: string = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    ),
    sortBy: string = this.fcFilterDialogService.getSortString(
      this.fcFilterConfig
    )
  ) {
    this.setParam();
    this.loading = true;
    this.layoutService.setSearchConfig({
      loading: true,
    });

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = this.page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = filterObj;
    dataListParameter.searchQuery = searchQuery;
    this.companyService
      .getCompanies(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.layoutService.setSearchConfig({
          loading: false,
        });
        this.totalRecords = res.data.count;
        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows)
            : 1;
        this.companies = res.data.companies;
      });
  }

  onPageUpdate(pagination: any) {
    let page = pagination.page;
    let rows = pagination.rows;
    this.rows = rows;
    if (page > 0) {
      this.page = page;
    } else {
      this.page = 1;
    }
    this.loadData(this.page);
  }

  navigateToDetail(company: any) {
    this.router.navigate(['/company/view/' + company]);
  }
}
