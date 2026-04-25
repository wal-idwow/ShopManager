/**
 * HomeScreen Component
 * 
 * Responsibilities:
 * - Serve as the landing page for the Mini Shop application.
 * - Display key metrics such as product count, total stock, and transaction count.
 * - Provide navigation buttons for quick access to transactions and products.
 * - Highlight low-stock products and recent transactions.
 * 
 * Features:
 * - Fetch and display product and transaction data from the API.
 * - Calculate and display total stock and low-stock products.
 * - Render a dashboard with inventory and transaction summaries.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom for programmatic navigation
import { getProducts, getTransactions } from '../services/api';
import { useUiSettings } from '../context/UiSettingsContext';

// HomeScreen component to display the home page with navigation buttons
const HomeScreen = () => {
  const navigate = useNavigate(); // Initialize the navigate function to enable navigation to different routes
  const { t } = useUiSettings(); // Access translation function from UI settings context
  const [products, setProducts] = React.useState([]); // State to store product data
  const [transactions, setTransactions] = React.useState([]); // State to store transaction data

  // Fetch product and transaction data when the component mounts
  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productData, transactionData] = await Promise.all([
          getProducts(),
          getTransactions(),
        ]);

        setProducts(productData);
        setTransactions(transactionData);
      } catch (error) {
        console.error('Error loading home screen data:', error);
      }
    };

    loadDashboard();
  }, []);

  // Calculate total stock and identify low-stock products
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStockProducts = products.filter((product) => Number(product.stock) <= 5);
  const lowStockCount = lowStockProducts.length;
  const latestTransactions = transactions.slice(-5).reverse(); // Get the 5 most recent transactions

  return (
    <section className="page-section">
      <div className="hero-banner">
        <div>
          <p className="section-kicker">{t('storeControlCenter')}</p>
          <h2>{t('homeHeroTitle')}</h2>
          <p className="hero-copy">{t('homeHeroCopy')}</p>
        </div>
        <div className="hero-actions">
          {/* Button to navigate to the purchase transactions page */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/transactions', { state: { presetType: 'purchase' } })}
          >
            {t('makePurchase')}
          </button>
          {/* Button to navigate to the sale transactions page */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/transactions', { state: { presetType: 'sale' } })}
          >
            {t('makeSale')}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {/* Display product count */}
        <article className="stat-card">
          <p className="section-kicker">{t('productsCount')}</p>
          <h3>{products.length}</h3>
          <span>{t('activeItems')}</span>
        </article>
        {/* Display total stock */}
        <article className="stat-card">
          <p className="section-kicker">{t('unitsInStock')}</p>
          <h3>{totalStock}</h3>
          <span>{t('totalStockText')}</span>
        </article>
        {/* Display transaction count */}
        <article className="stat-card">
          <p className="section-kicker">{t('transactionsCount')}</p>
          <h3>{transactions.length}</h3>
          <span>{t('purchaseSaleRecords')}</span>
        </article>
        {/* Display low-stock product count */}
        <article className="stat-card">
          <p className="section-kicker">{t('lowStock')}</p>
          <h3>{lowStockCount}</h3>
          <span>{t('lowStockText')}</span>
          <div className="low-stock-names">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <span key={product.id} className="low-stock-pill">
                  {product.name}
                </span>
              ))
            ) : (
              <p className="low-stock-empty">{t('noLowStockProducts')}</p>
            )}
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        {/* Inventory snapshot section */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">{t('inventorySnapshot')}</p>
              <h2>{t('topProducts')}</h2>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
              {t('viewProducts')}
            </button>
          </div>
          <div className="mini-list">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="mini-list-row">
                <div>
                  <strong>{product.name}</strong>
                  <p>${Number(product.sell_price).toFixed(2)} {t('sellingPrice')}</p>
                </div>
                <span className={`status-badge ${Number(product.stock) <= 5 ? 'low' : 'healthy'}`}>
                  {product.stock} {t('inStock')}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent transactions section */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">{t('recentActivity')}</p>
              <h2>{t('latestTransactions')}</h2>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              {t('viewTransactions')}
            </button>
          </div>
          <div className="mini-list">
            {latestTransactions.map((transaction) => (
              <div key={transaction.id} className="mini-list-row">
                <div>
                  <strong>{transaction.transaction_type === 'sale' ? t('sale') : t('purchase')}</strong>
                  <p>{new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
                <span>${Number(transaction.total_price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

// Export the HomeScreen component as the default export of this module
export default HomeScreen;
