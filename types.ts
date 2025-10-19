
export interface ProductMaster {
  id: string;
  product_name: string;
  category: string;
  subcategory: string;
  images: string[];
  purchase_date: string; // ISO string
  purchase_price: number;
  color: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  product_master_id: string;
  size_label: string;
  quantity: number;
}

export enum PriceType {
  Selling = "Selling",
  GeneralDiscount = "GeneralDiscount",
  SpecialDiscount = "SpecialDiscount",
}

export interface SaleItem {
  id: string;
  product_variant_id: string;
  product_master_id: string;
  quantity: number;
  unit_price_at_time_of_sale: number;
  unit_price_selected_type: PriceType;
  adjusted_purchase_price: number;
}

export interface SaleOrder {
  id: string;
  items: SaleItem[];
  final_paid_amount: number;
  sale_date: string; // ISO string
  profit: number;
}

export interface CalculatedPrices {
  selling_price: number;
  general_discount_price: number;
  special_discount_price: number;
  adjusted_purchase_price: number;
}

export type ActiveView = 'inventory' | 'sales' | 'reports';
