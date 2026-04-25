/**
 * ProductList Component
 * 
 * Responsibilities:
 * - Display a list of products using the `ProductCard` component.
 * - Render a message if no products are available.
 * 
 * Props:
 * - `products`: Array of product objects to display.
 * - `onDelete`: Function to handle deleting a product.
 * - `onEdit`: Function to handle editing a product.
 */

import React from 'react'; // Import React for creating the component
import ProductCard from './ProductCard'; // Import ProductCard component to display individual product details and actions
import { useUiSettings } from '../context/UiSettingsContext';

// ProductList component to display a list of products using the ProductCard component
const ProductList = ({ products, onDelete, onEdit }) => {
  const { t } = useUiSettings(); // Access translation function from UI settings context

  // If there are no products to display, show a message indicating that no products were found
  if (!products || products.length === 0) {
    return <p className="empty-state">{t('noProductsFound')}</p>;
  }

  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            {/* Table headers for product details */}
            <th>{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('buyPrice')}</th>
            <th>{t('sellPrice')}</th>
            <th>{t('stock')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {/* Render a ProductCard for each product in the list */}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export the ProductList component as the default export of this module
export default ProductList;
