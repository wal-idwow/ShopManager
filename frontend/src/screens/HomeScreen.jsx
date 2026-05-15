/**
 * HomeScreen Component
 *
 * Responsibilities:
 * - Serve as the landing page for authenticated users
 * - Display dashboard with inventory and transaction summaries
 * - Show product stats and recent transactions
 *
 * Features:
 * - Shows landing page for unauthenticated users
 * - Shows dashboard for authenticated users
 * - Display low-stock warnings
 * - Render recent transactions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom for programmatic navigation
import { useAuth } from '../context/AuthContext';
import { getProducts, getTransactions } from '../services/api';
import { useUiSettings } from '../context/UiSettingsContext';

const featureCards = [
  { key: 'featureInventory', copyKey: 'featureInventoryCopy' },
  { key: 'featureTransactions', copyKey: 'featureTransactionsCopy' },
  { key: 'featureRoles', copyKey: 'featureRolesCopy' },
  { key: 'featureInsights', copyKey: 'featureInsightsCopy' },
];

// HomeScreen component to display the home page with navigation buttons
const HomeScreen = () => {
  const navigate = useNavigate(); // Initialize the navigate function to enable navigation to different routes
  const { t } = useUiSettings(); // Access translation function from UI settings context
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = React.useState([]); // State to store product data
  const [transactions, setTransactions] = React.useState([]); // State to store transaction data
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');

  // Fetch product and transaction data when the component mounts (only if authenticated)
  React.useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const [productData, transactionData] = await Promise.all([
          getProducts(),
          getTransactions(),
        ]);

        setProducts(productData);
        setTransactions(transactionData);
      } catch (error) {
        console.error('Error loading home screen data:', error);
        setLoadError(t('failedLoadHomeData'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, t]);

  // Calculate total stock and identify low-stock products
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const lowStockProducts = products.filter((product) => Number(product.stock) <= 5);
  const lowStockCount = lowStockProducts.length;
  const latestTransactions = transactions.slice(-5).reverse(); // Get the 5 most recent transactions

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="hero-banner landing-hero">
          <div className="landing-copy">
            <p className="section-kicker">{t('landingEyebrow')}</p>
            <h2>{t('landingTitle')}</h2>
            <p className="hero-copy">{t('landingCopy')}</p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>

          <aside className="access-card">
            <p className="section-kicker">{t('accessPortal')}</p>
            <h3>{t('guestAccount')}</h3>
            <p>{t('guestAccessCopy')}</p>
            <ul className="access-list">
              <li>{t('roleGuest')}</li>
              <li>{t('roleUser')}</li>
              <li>{t('roleAdmin')}</li>
            </ul>
          </aside>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article key={feature.key} className="feature-card">
              <p className="section-kicker">{t(feature.key)}</p>
              <h3>{t(feature.key)}</h3>
              <p>{t(feature.copyKey)}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Show dashboard for authenticated users
  return (
    <section className="page-section">
      {loadError ? <p className="error-banner">{loadError}</p> : null}

      <div className="hero-banner">
        <div className="landing-copy">
          <p className="section-kicker">{t('dashboard')}</p>
          <h2>{t('dashboardTitle') || 'Welcome Back'}</h2>
          <p className="hero-copy">{t('dashboardCopy') || 'Here is your inventory overview'}</p>
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
              <p className="section-kicker">{t('dashboardPreview')}</p>
              <h2>{t('topProducts')}</h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
            >
              {t('viewProducts')}
            </button>
          </div>
          <div className="mini-list">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="mini-list-row">
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {t('sellingPrice')} : {Number(product.sell_price).toFixed(2)} {t('currency')}
                  </p>
                </div>
                <span className={`status-badge ${Number(product.stock) <= 5 ? 'low' : 'healthy'}`}>
                  {product.stock} {t('inStock')}
                </span>
              </div>
            ))}
            {!loading && products.length === 0 ? <p className="empty-state">{t('noProductsFound')}</p> : null}
          </div>
        </section>

        {/* Recent transactions section */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">{t('recentActivity')}</p>
              <h2>{t('latestTransactions')}</h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/transactions')}
            >
              {t('viewTransactions')}
            </button>
          </div>
          <div className="mini-list">
            {latestTransactions.map((transaction) => (
              <div key={transaction.id} className="mini-list-row">
                <div>
                  <strong>
                    {transaction.transaction_type === 'sale' ? t('sale') : t('purchase')}
                  </strong>
                  <p>{new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
                <span>{Number(transaction.total_price).toFixed(2)} {t('currency')}</span>
              </div>
            ))}
            {!loading && latestTransactions.length === 0 ? (
              <p className="empty-state">{t('noTransactionsFound')}</p>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
};

// Export the HomeScreen component as the default export of this module
export default HomeScreen;
