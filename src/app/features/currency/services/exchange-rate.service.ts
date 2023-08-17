import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  constructor(private http: HttpClient) {}

  getExchangeRates(
    dataListParameter: DataListParameter = {} as DataListParameter
  ) {
    let param = '';
    if (dataListParameter.rows && dataListParameter.page) {
      param = param.concat(
        `?page=${dataListParameter.page}&limit=${dataListParameter.rows}`
      );
    }
    if (dataListParameter.sortBy) {
      param = param.concat('&' + dataListParameter.sortBy);
    }
    if (dataListParameter.filterObj) {
      param = param.concat('&' + dataListParameter.filterObj);
    }

    if (dataListParameter.searchQuery) {
      if (!dataListParameter.sortBy) {
        param = param.concat('?q=' + dataListParameter.searchQuery);
      } else {
        param = param.concat('&q=' + dataListParameter.searchQuery);
      }
    }
    return this.http.get(`${ROOT_API}/admin/exchange-rates${param}`);
  }

  getExchangeRate(id: string) {
    return this.http.get(`${ROOT_API}/admin/exchange-rates/${id}`);
  }
  addExchangeRate(currency: any) {
    return this.http.post(`${ROOT_API}/admin/exchange-rates`, currency);
  }
  updateExchangeRate(id: string, currency: any) {
    return this.http.put(`${ROOT_API}/admin/exchange-rates/${id}`, currency);
  }
  deleteExchangeRate(id: string) {
    return this.http.delete(`${ROOT_API}/admin/exchange-rates/${id}`);
  }
}
