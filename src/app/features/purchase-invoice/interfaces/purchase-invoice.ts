import { Product } from '@features/product/interfaces/product.interface';
import { PurchaseOrder } from '@features/purchase-order/interfaces/purchase-order';
import { Supplier } from '@features/supplier/interfaces/supplier';

export interface PurchaseInvoice {
  status_name: string;
  id: string;
  invoice_no: string;
  purchase_order: PurchaseOrder;
  purchase_order_id: string;
  supplier_id: number;
  date: Date;
  due_date: Date;
  status: number;
  subtotal: string;
  tax: number;
  grandtotal: number;
  note: string;
  business_unit_id: number;
  created_by: number;
  updated_by: any;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  purchase_invoice_details: PurchaseInvoiceDetail[];
  supplier: Supplier;
  remaining_amount: number;
  showDetail?: boolean;
  purchaseInvoiceDetailLoaded?: boolean;
  loading?: boolean;
  product: Product;
  exist?: boolean;
}
export interface PurchaseInvoiceDetail {
  id: number;
  purchase_invoice_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  remaining_quantity: number;
  unit_price: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}
