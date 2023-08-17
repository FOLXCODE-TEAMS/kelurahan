import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  faChevronDown,
  faPencil,
  faPlus,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductSelectDialogComponent } from '@features/product/components/product-select-dialog/product-select-dialog.component';
import { PurchaseOrderWarehouseAddDialogComponent } from '../purchase-order-warehouse-add-dialog/purchase-order-warehouse-add-dialog.component';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { SupplierQuotationSelectDetailDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-select-detail-dialog/supplier-quotation-select-detail-dialog.component';

@Component({
  selector: 'app-purchase-order-add-detail',
  templateUrl: './purchase-order-add-detail.component.html',
  styleUrls: ['./purchase-order-add-detail.component.css'],
})
export class PurchaseOrderAddDetailComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  loading = false;
  title = '';

  selectedProduct: any;
  existingPurchaseOrderDetails: any;

  purchaseOrderDetailForm: FormGroup;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    if (this.config.data.existingPurchaseOrderDetails) {
      this.existingPurchaseOrderDetails =
        this.config.data.existingPurchaseOrderDetails;
    }

    this.purchaseOrderDetailForm = new FormGroup({
      quotation_no: new FormControl('', Validators.required),
      supplier_quotation: new FormControl(null),
      product: new FormControl(null, Validators.required),
      price_per_unit: new FormControl(null, Validators.required),
      expected_delivery_date: new FormControl(null),
      purchase_order_warehouses: new FormArray([], Validators.required),
    });

    if (this.config.data.purchaseOrderDetail) {
      let data = this.config.data.purchaseOrderDetail;
      this.selectedProduct = data.product;
      this.purchaseOrderDetailForm.patchValue({
        quotation_no: data.quotation_no,
        supplier_quotation: data.supplier_quotation,
        product: data.product,
        price_per_unit: data.price_per_unit,
        expected_delivery_date: data.expected_delivery_date,
      });
      data.purchase_order_warehouses.forEach((data: any) => {
        this.purchaseOrderWarehouse.push(
          new FormGroup({
            warehouse: new FormControl(data.warehouse, Validators.required),
            quantity_ordered: new FormControl(
              data.quantity_ordered,
              Validators.required
            ),
          })
        );
      });
    }
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  get purchaseOrderWarehouse(): FormArray {
    return this.purchaseOrderDetailForm.get(
      'purchase_order_warehouses'
    ) as FormArray;
  }

  isSubmitAllowed(): boolean {
    if (this.purchaseOrderDetailForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  removeProduct() {
    this.purchaseOrderDetailForm.controls['product'].setValue(null);
  }

  onSelectProduct() {
    let existProduct: any[] = [];
    // Push for Existing Product
    if (this.existingPurchaseOrderDetails.length > 0) {
      this.existingPurchaseOrderDetails.forEach((data: any) => {
        existProduct.push({
          product: data.product,
        });
      });
    } else {
      if (this.purchaseOrderDetailForm.value.product != null) {
        existProduct.push({
          product: this.purchaseOrderDetailForm.value.product,
        });
      }
    }

    const ref = this.dialogService.open(ProductSelectDialogComponent, {
      data: {
        title: 'Select Product',
        existingProduct: existProduct,
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((product) => {
      if (product) {
        this.purchaseOrderDetailForm.controls['product'].setValue(product);
        this.purchaseOrderDetailForm.controls['price_per_unit'].setValue(
          product.base_price
        );
      }
    });
  }

  addWarehouseDetail() {
    const ref = this.dialogService.open(
      PurchaseOrderWarehouseAddDialogComponent,
      {
        data: {
          title: 'Add Purchase Warehouse Detail',
          existingWarehouse: this.purchaseOrderWarehouse.value,
        },
        showHeader: false,
        contentStyle: {
          padding: '0',
        },
        style: {
          overflow: 'hidden',
        },
        styleClass: 'rounded-sm',
        dismissableMask: true,
        width: '350px',
      }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        this.purchaseOrderWarehouse.push(
          new FormGroup({
            warehouse: new FormControl(data.warehouse, Validators.required),
            quantity_ordered: new FormControl(
              data.quantity_ordered,
              Validators.required
            ),
          })
        );
      }
    });
  }

  editPurchaseWarehouseDetail(index: number) {
    const ref = this.dialogService.open(
      PurchaseOrderWarehouseAddDialogComponent,
      {
        data: {
          title: 'Edit Purchase Warehouse Detail',
          existingWarehouse: this.purchaseOrderWarehouse.value,
          purchaseOrderWarehouse: this.purchaseOrderWarehouse.value[index],
        },
        showHeader: false,
        contentStyle: {
          padding: '0',
        },
        style: {
          overflow: 'hidden',
        },
        styleClass: 'rounded-sm',
        dismissableMask: true,
        width: '350px',
      }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        this.purchaseOrderWarehouse.at(index).patchValue(data);
      }
    });
  }

  removePurchaseWarehouseDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseOrderWarehouse.removeAt(index);
      },
    });
  }

  onSelectSupplierQuotation() {
    let existProduct: any[] = [];
    if (this.existingPurchaseOrderDetails.length > 0) {
      this.existingPurchaseOrderDetails.forEach((data: any) => {
        existProduct.push({
          product: data.product,
        });
      });
    }

    const ref = this.dialogService.open(
      SupplierQuotationSelectDetailDialogComponent,
      {
        data: {
          title: 'Select Supplier Quotation',
          existingProduct: existProduct,
        },
        showHeader: false,
        contentStyle: {
          padding: '0',
        },
        style: {
          overflow: 'hidden',
        },
        styleClass: 'rounded-sm',
        dismissableMask: true,
        width: '450px',
      }
    );
    ref.onClose.subscribe((supplierQuotation) => {
      if (supplierQuotation) {
        this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(
          supplierQuotation
        );

        this.purchaseOrderDetailForm.controls['quotation_no'].setValue(
          supplierQuotation.quotation_no
        );

        this.purchaseOrderDetailForm.controls['product'].setValue(
          supplierQuotation.product
        );

        this.purchaseOrderDetailForm.controls['price_per_unit'].setValue(
          supplierQuotation.price_per_unit
        );

        this.purchaseOrderDetailForm.controls[
          'expected_delivery_date'
        ].setValue(supplierQuotation.expected_delivery_date);
      }
    });
  }

  removeSupplierQuotation() {
    this.purchaseOrderDetailForm.controls['supplier_quotation'].setValue(null);
    this.purchaseOrderDetailForm.controls['quotation_no'].setValue(null);
    this.purchaseOrderDetailForm.controls['product'].setValue(null);
    this.purchaseOrderDetailForm.controls['price_per_unit'].setValue(null);
    this.purchaseOrderDetailForm.controls['expected_delivery_date'].setValue(
      null
    );
  }

  onClose() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.purchaseOrderDetailForm.value);
  }
}
