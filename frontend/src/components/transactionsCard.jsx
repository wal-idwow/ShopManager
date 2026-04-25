/**
 * TransactionCard Component
 * 
 * Responsibilities:
 * - Display transaction details including product name, type, quantity, and total price.
 * - Fetch and display the product name based on the product ID.
 * 
 * Props:
 * - `transaction`: Object containing transaction details (id, product_id, transaction_type, quantity, total_price, timestamp).
 */

import React from 'react';
import { getProductById, getProducts } from '../services/api';
import { useUiSettings } from '../context/UiSettingsContext';

const TransactionCard = ({ transaction }) => {
  const { t } = useUiSettings();
  const [productName, setProductName] = React.useState('');

  React.useEffect(() => {
    if (!transaction?.product_id) {
      setProductName('');
      return;
    }

    const fetchProductName = async () => {
      try {
        const product = await getProductById(transaction.product_id);
        setProductName(product.name);
      } catch (error) {
        console.error('Error fetching product name:', error);
        setProductName(t('unknownProduct'));
      }
    };

    fetchProductName();
  }, [transaction?.product_id, t]);

  if (!transaction) {
    return null;
  }

  return (
    <tr>
      <td>#{transaction.id}</td>
      <td>{transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : t('notAvailable')}</td>
      <td className="cell-strong">{productName || t('loading')}</td>
      <td>{transaction.product_id ?? t('notAvailable')}</td>
      <td>
        <span className={`status-badge ${transaction.transaction_type === 'sale' ? 'sale' : 'purchase'}`}>
          {transaction.transaction_type === 'sale' ? t('sale') : t('purchase')}
        </span>
      </td>
      <td>{transaction.quantity ?? t('notAvailable')}</td>
      <td>${Number(transaction.total_price ?? 0).toFixed(2)}</td>
    </tr>
  );
};

/**
 * TransactionForm Component
 * 
 * Responsibilities:
 * - Provide a form to record new transactions.
 * - Validate user input and handle form submission.
 * - Fetch and display available products for selection.
 * 
 * Props:
 * - `onSubmit`: Function to handle form submission.
 * - `initialType`: Initial transaction type (default: 'purchase').
 * - `title`: Title of the form (default: 'Record Transaction').
 */

const TransactionForm = ({ onSubmit, initialType = 'purchase', title = 'Record Transaction' }) => {
  const { t } = useUiSettings();
  const [products, setProducts] = React.useState([]);
  const [productName, setProductName] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [type, setType] = React.useState(initialType);
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setType(initialType || 'purchase');
  }, [initialType]);

  React.useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!isMounted) {
          return;
        }

        setProducts(data);
        if (data.length > 0) {
          setProductName((currentValue) => {
            const selectedStillExists = data.some((product) => product.name === currentValue);
            if (selectedStillExists) {
              return currentValue;
            }

            return data[0].name;
          });
        }
      } catch (loadError) {
        console.error('Error fetching products for transaction form:', loadError);
        setError(t('unableLoadProducts'));
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productName) {
      setError(t('chooseProduct'));
      return;
    }

    if (!quantity || quantity <= 0) {
      setError(t('quantityGreaterZero'));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        product_name: productName.trim(),
        quantity,
        transaction_type: type,
      });
      setQuantity(1);
      const refreshedProducts = await getProducts();
      setProducts(refreshedProducts);
      setProductName((currentValue) => {
        const selectedStillExists = refreshedProducts.some((product) => product.name === currentValue);
        if (selectedStillExists) {
          return currentValue;
        }

        return refreshedProducts[0]?.name || '';
      });
    } catch (submitError) {
      setError(submitError?.response?.data?.error || t('failedSaveTransaction'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel form-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">{t('newActivity')}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {error && <p className="error-banner">{error}</p>}
      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="transaction-product-name">{t('productName')}</label>
          <select
            id="transaction-product-name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name} ({product.stock} {t('inStock')})
              </option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="transaction-quantity">{t('quantity')}</label>
          <input
            id="transaction-quantity"
            type="number"
            min="1"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="field-group">
          <label htmlFor="transaction-type">{t('type')}</label>
          <select id="transaction-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="purchase">{t('purchase')}</option>
            <option value="sale">{t('sale')}</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || products.length === 0}>
          {isSubmitting ? t('saving') : type === 'sale' ? t('makeSale') : t('makePurchase')}
        </button>
      </div>
    </form>
  );
};

export { TransactionForm };
export default TransactionCard;
