/**
 * ProductScreen Component
 *
 * Responsibilities:
 * - Display a list of products with options to add, edit, or delete products.
 * - Provide a form for creating or editing products based on the presence of an ID in the URL.
 * - Handle API calls for fetching, creating, updating, and deleting products.
 * - Validate form inputs and display error messages for invalid data or API failures.
 *
 * Features:
 * - Controlled form fields for product details (name, buy price, sell price, stock).
 * - Conditional rendering for product list view and product form view.
 * - Navigation between product list and form views.
 */

import React, { useState, useEffect } from 'react'; // Import necessary hooks and components
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import hooks for routing
import { useQuery, useQueryClient } from 'react-query'; // Import React Query hooks for data fetching and caching
import ProductList from '../components/ProductList'; // Import ProductList component to display the list of products
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductById,
} from '../services/api'; // Import API functions for product operations
import { useUiSettings } from '../context/UiSettingsContext';

// ProductScreen component to handle both product listing and product form for creating/editing products
const ProductScreen = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters to determine if we are in edit mode or create mode
  const navigate = useNavigate(); // Hook to programmatically navigate to different routes
  const location = useLocation(); // Hook to get the current location
  const { t } = useUiSettings();

  // Get query client for manual cache invalidation
  const queryClient = useQueryClient();

  // Fetch products using React Query's useQuery hook - provides caching and automatic refetching
  const { data: products = [] } = useQuery('products', getProducts, {
    staleTime: 1000 * 60 * 5, // Cache products for 5 minutes
    cacheTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });

  // State variables to manage products and form fields
  const [name, setName] = useState(''); // State to hold the name of the product being created or edited
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState(null);
  const isListView = location.pathname === '/products';

  // Fetch product details if in edit mode using React Query
  const { data: editProduct } = useQuery(['product', id], () => getProductById(id), {
    enabled: !!id, // Only fetch if id exists (in edit mode)
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  // Populate form fields when editing a product
  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setBuyPrice(editProduct.buy_price);
      setSellPrice(editProduct.sell_price);
      setStock(editProduct.stock);
    }
  }, [editProduct]);

  // Handle deleting a product
  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteProduct'))) {
      return;
    }

    try {
      await deleteProduct(id);
      // Invalidate the products query cache to trigger automatic refetch
      queryClient.invalidateQueries('products');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.response?.data?.error || t('failedDeleteProduct'));
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    if (!window.confirm(t('confirmEditProduct'))) {
      return;
    }

    navigate(`/products/edit/${product.id}`);
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setError(null);
    setName('');
    setBuyPrice('');
    setSellPrice('');
    setStock('');
    navigate('/products/new');
  };

  // Handle form submission for creating or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || buyPrice <= 0 || sellPrice <= 0 || stock < 0) {
      setError(t('pleaseEnterValidValues'));
      return;
    }

    const productData = {
      name,
      buy_price: parseFloat(buyPrice),
      sell_price: parseFloat(sellPrice),
      stock: parseInt(stock, 10),
    };

    try {
      if (id) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      // Invalidate the products query cache to trigger automatic refetch
      queryClient.invalidateQueries('products');
      setName('');
      setBuyPrice('');
      setSellPrice('');
      setStock('');
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.error || t('failedSaveProduct'));
    }
  };

  // Render product list or product form based on the current view
  if (isListView) {
    return (
      <section className="page-section">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">{t('inventory')}</p>
            <h2>{t('productList')}</h2>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
            {t('addProduct')}
          </button>
        </div>
        {error && <p className="error-banner">{error}</p>}
        <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />
      </section>
    );
  }

  return (
    <section className="page-section">
      <form onSubmit={handleSubmit} className="panel form-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">{id ? t('updateInventory') : t('newInventoryItem')}</p>
            <h2>{id ? t('editProduct') : t('addProduct')}</h2>
          </div>
        </div>
        {error && <p className="error-banner">{error}</p>}
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="product-name">{t('name')}</label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="product-buy-price">{t('buyPrice')}</label>
            <input
              id="product-buy-price"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="product-sell-price">{t('sellPrice')}</label>
            <input
              id="product-sell-price"
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="product-stock">{t('stock')}</label>
            <input
              id="product-stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? t('updateProduct') : t('addProduct')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
            {t('backToList')}
          </button>
        </div>
      </form>
    </section>
  );
};

// Export the ProductScreen component as the default export of this module
export default ProductScreen;
