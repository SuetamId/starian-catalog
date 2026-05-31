import { describe, expect, it } from 'vitest';

import { ApiProduct } from '../models/product.model';
import { filterProducts } from './filter-products';

describe('filterProducts', () => {
  const products: ApiProduct[] = [
    {
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Your perfect pack for everyday use.',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      id: 2,
      title: 'Gold Ring',
      price: 695,
      description: 'A beautiful gold ring.',
      category: 'jewelery',
      image: 'https://fakestoreapi.com/img/gold-ring.jpg',
    },
  ];

  it('returns all products when filters are empty', () => {
    expect(filterProducts(products, '', null)).toEqual(products);
  });

  it('filters by search term in title', () => {
    expect(filterProducts(products, 'gold', null)).toEqual([products[1]]);
  });

  it('filters by category', () => {
    expect(filterProducts(products, '', 'jewelery')).toEqual([products[1]]);
  });

  it('combines search term and category', () => {
    expect(filterProducts(products, 'backpack', 'men\'s clothing')).toEqual([products[0]]);
    expect(filterProducts(products, 'backpack', 'jewelery')).toEqual([]);
  });

  it('ignores surrounding whitespace in search term', () => {
    expect(filterProducts(products, '  gold  ', null)).toEqual([products[1]]);
  });
});
