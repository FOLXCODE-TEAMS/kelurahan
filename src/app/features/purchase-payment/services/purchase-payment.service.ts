import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class PurchasePaymentService {
  constructor(private http: HttpClient) {}

  getPurchasePayments(
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
    return this.http.get(`${ROOT_API}/admin/purchase-payments${param}`);
  }
  getPurchasePayment(id: string) {
    return this.http.get(`${ROOT_API}/admin/purchase-payments/${id}`);
  }
  addPurchasePayment(supplier: any) {
    return this.http.post(`${ROOT_API}/admin/purchase-payments`, supplier);
  }
  updatePurchasePayment(id: string, supplier: any) {
    return this.http.put(`${ROOT_API}/admin/purchase-payments/${id}`, supplier);
  }
  deletePurchasePayment(id: string) {
    return this.http.delete(`${ROOT_API}/admin/purchase-payments/${id}`);
  }
  approvePurchasePayment(id: string) {
    return this.http.put(
      `${ROOT_API}/admin/purchase-payments/${id}/approved`,
      {}
    );
  }
  cancelPurchasePayment(id: string) {
    return this.http.put(
      `${ROOT_API}/admin/purchase-payments/${id}/cancelled`,
      {}
    );
  }
  // manage purchase payment detail
  addPurchasePaymentDetail(purchasePaymentId: any, purchasePaymentDetail: any) {
    return this.http.post(
      `${ROOT_API}/admin/purchase-payments/${purchasePaymentId}/details`,
      purchasePaymentDetail
    );
  }
  updatePurchasePaymentDetail(
    purchasePaymentId: string,
    purchasePaymentDetail: any,
    purchasePaymentDetailId: string
  ) {
    return this.http.put(
      `${ROOT_API}/admin/purchase-payments/${purchasePaymentId}/details/${purchasePaymentDetailId}`,
      purchasePaymentDetail
    );
  }
  deletePurchasePaymentDetail(
    purchasePaymentId: string,
    purcasePaymentDetailId: string
  ) {
    return this.http.delete(
      `${ROOT_API}/admin/purchase-payments/${purchasePaymentId}/details/${purcasePaymentDetailId}`
    );
  }
}
