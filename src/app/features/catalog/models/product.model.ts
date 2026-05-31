export interface ApiProductRating {
  rate: number;
  count: number;
}

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ApiProductRating;
}

export type CreateProductPayload = Omit<ApiProduct, 'id' | 'rating'>;

export type UpdateProductPayload = CreateProductPayload;
