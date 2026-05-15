/**
 * ProductCard Component
 *
 * Responsibilities:
 * - Display product details including name, buy price, sell price, and stock.
 * - Provide actions to edit or delete the product.
 *
 * Props:
 * - `product`: Object containing product details (id, name, buy_price, sell_price, stock).
 * - `onDelete`: Function to handle product deletion.
 * - `onEdit`: Function to handle product editing.
 */

import React from 'react'; // Import React for creating the component
import { useUiSettings } from '../context/UiSettingsContext';

// ProductCard component to display product details and actions
const ProductCard = ({ product, onDelete, onEdit }) => {
  const { t } = useUiSettings(); // Access translation function from UI settings context

  // Determine stock status class based on stock quantity
  const stockClassName = product.stock <= 5 ? 'status-badge low' : 'status-badge healthy';

  return (
    <tr>
      {/* Display product ID */}
      <td>#{product.id}</td>

      {/* Display product name */}
      <td className="cell-strong">{product.name}</td>

      {/* Display product buy price */}
      <td>${Number(product.buy_price).toFixed(2)}</td>

      {/* Display product sell price */}
      <td>${Number(product.sell_price).toFixed(2)}</td>

      {/* Display product stock with status badge */}
      <td>
        <span className={stockClassName}>
          {product.stock} {t('inStock')}
        </span>
      </td>

      {/* Display action buttons for editing and deleting the product */}
      <td>
        <div className="table-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEdit(product)}
            title={`Edit ${product.name}`}
          >
            {t('edit')}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(product.id)}
            title={`Delete ${product.name}`}
          >
            {t('delete')}
          </button>
        </div>
      </td>
    </tr>
  );
};

// Export the ProductCard component as the default export of this module
export default ProductCard;
