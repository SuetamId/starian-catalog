import { ApiProduct } from '../../../catalog/models/product.model';

export interface StoreCartItem {
  product: ApiProduct;
  quantity: number;
}

export interface StoreCartState {
  items: StoreCartItem[];
}
