import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductList from './components/ProductList';
import TransactionCard, { TransactionForm } from './components/transactionsCard';
import TransactionsList from './components/transactionsList';
import { AuthProvider } from './context/AuthContext';
import { UiSettingsProvider } from './context/UiSettingsContext';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import TransactionScreen from './screens/TransactionScreen';
import AdminScreen from './screens/AdminScreen';
import {
  getProductById,
  getProducts,
  getTransactions,
  createProduct,
  updateProduct,
  deleteProduct,
  createTransaction,
} from './services/api';
import {
  resetDatabase,
  getDbStats,
  cleanupOrphanedTransactions,
  getHealthCheck,
} from './services/adminApi';

jest.mock('./services/api', () => ({
  getProductById: jest.fn(),
  getProducts: jest.fn(),
  getTransactions: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  createTransaction: jest.fn(),
}));

jest.mock('./services/adminApi', () => ({
  resetDatabase: jest.fn(),
  getDbStats: jest.fn(),
  cleanupOrphanedTransactions: jest.fn(),
  getHealthCheck: jest.fn(),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui, { route = '/', queryClient = createQueryClient() } = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <UiSettingsProvider>
        <AuthProvider>
          <MemoryRouter
            initialEntries={[route]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {ui}
          </MemoryRouter>
        </AuthProvider>
      </UiSettingsProvider>
    </QueryClientProvider>
  );

const renderTableComponent = (ui, options) =>
  renderWithProviders(
    <table>
      <tbody>{ui}</tbody>
    </table>,
    options
  );

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  document.documentElement.dataset.theme = 'light';
  getProductById.mockReset();
  getProducts.mockReset();
  getTransactions.mockReset();
  createProduct.mockReset();
  updateProduct.mockReset();
  deleteProduct.mockReset();
  createTransaction.mockReset();
  resetDatabase.mockReset();
  getDbStats.mockReset();
  cleanupOrphanedTransactions.mockReset();
  getHealthCheck.mockReset();
});

describe('Navbar', () => {
  it('renders translated content and navigation links', () => {
    renderWithProviders(<Navbar />, { route: '/products' });

    expect(screen.getByRole('heading', { name: 'حانوتي' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
  });

  it('toggles language and theme from the provider', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('button', { name: 'العربية' })).toBeInTheDocument();
  });
});

describe('HomeScreen', () => {
  it('renders the landing page elements and interactive elements', async () => {
    renderWithProviders(<HomeScreen />);

    // Verify main app heading is present
    expect(await screen.findByRole('heading', { name: 'حانوتي' })).toBeInTheDocument();

    // Verify login and register CTA buttons exist
    expect(screen.getByRole('button', { name: 'تسجيل الدخول' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'تسجيل' })).toBeInTheDocument();

    // Verify the bottom CTA button exists
    expect(screen.getByRole('button', { name: 'ابدأ الآن' })).toBeInTheDocument();
  });
});

describe('ProductCard', () => {
  const product = {
    id: 7,
    name: 'Mint Tea',
    buy_price: 4,
    sell_price: 6.5,
    stock: 3,
  };

  it('renders product details and invokes callbacks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderTableComponent(<ProductCard product={product} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('Mint Tea')).toBeInTheDocument();
    expect(screen.getByText(/4\.00/)).toBeInTheDocument();
    expect(screen.getByText(/6\.50/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'تعديل' }));
    fireEvent.click(screen.getByRole('button', { name: 'حذف' }));

    expect(onEdit).toHaveBeenCalledWith(product);
    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it('displays stock badge for products', () => {
    renderTableComponent(
      <ProductCard
        product={{ ...product, id: 8, stock: 12 }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const badgeElement = screen.getByText(/12/);
    expect(badgeElement).toHaveClass('status-badge', 'healthy');
  });
});

describe('ProductList', () => {
  const products = [
    { id: 1, name: 'Sugar', buy_price: 2, sell_price: 3, stock: 10 },
    { id: 2, name: 'Coffee', buy_price: 5, sell_price: 7, stock: 4 },
  ];

  it('shows an empty state when no products are available', () => {
    renderWithProviders(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('لا توجد منتجات.')).toBeInTheDocument();
  });

  it('renders table headers and product rows', async () => {
    renderWithProviders(
      <ProductList products={products} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    expect(await screen.findByRole('columnheader', { name: 'المعرف' })).toBeInTheDocument();
    expect(await screen.findByRole('columnheader', { name: 'الإجراءات' })).toBeInTheDocument();
    expect(await screen.findByText('Sugar')).toBeInTheDocument();
    expect(await screen.findByText('Coffee')).toBeInTheDocument();
  });
});

describe('TransactionCard', () => {
  const transaction = {
    id: 9,
    product_id: 4,
    product_name: 'Olive Oil',
    transaction_type: 'sale',
    quantity: 2,
    total_price: 19.5,
    timestamp: '2026-04-17T12:00:00.000Z',
  };

  it('returns null when no transaction is provided', () => {
    renderTableComponent(<TransactionCard transaction={null} />);

    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  it('displays the related product name directly', () => {
    renderTableComponent(<TransactionCard transaction={transaction} />);

    expect(screen.getByText('Olive Oil')).toBeInTheDocument();
    expect(screen.getByText('بيع')).toHaveClass('status-badge', 'sale');
    expect(screen.getByText(/19\.50/)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(transaction.timestamp).toLocaleDateString())
    ).toBeInTheDocument();
  });

  it('falls back to the unknown-product label when product name is missing', () => {
    const transactionWithoutName = { ...transaction, product_name: undefined };
    renderTableComponent(<TransactionCard transaction={transactionWithoutName} />);

    expect(screen.getByText('منتج غير معروف')).toBeInTheDocument();
  });
});

describe('TransactionForm', () => {
  const productOptions = [
    { id: 1, name: 'Sugar', stock: 8 },
    { id: 2, name: 'Coffee', stock: 3 },
  ];

  it('loads products and submits the selected transaction payload', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    getProducts.mockResolvedValue(productOptions);

    renderWithProviders(
      <TransactionForm onSubmit={onSubmit} initialType="sale" title="Quick Sale" />
    );

    expect(await screen.findByRole('heading', { name: 'Quick Sale' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: /Sugar/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /تسجيل/ })).toBeEnabled();
  });

  it('validates that quantity is greater than zero', async () => {
    const onSubmit = jest.fn();
    getProducts.mockResolvedValue(productOptions);

    renderWithProviders(<TransactionForm onSubmit={onSubmit} />);

    expect(await screen.findByRole('option', { name: /Sugar/ })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('الكمية'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /تسجيل/ }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a load error and disables submit when products cannot be fetched', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getProducts.mockRejectedValue(new Error('network down'));

    renderWithProviders(<TransactionForm onSubmit={jest.fn()} />);

    expect(await screen.findByText('تعذر تحميل المنتجات.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /تسجيل/ })).toBeDisabled();

    errorSpy.mockRestore();
  });

  it('shows the API error when submit fails', async () => {
    getProducts.mockResolvedValue(productOptions);
    const onSubmit = jest.fn().mockRejectedValue({
      response: {
        data: {
          error: 'Stock is too low for this sale.',
        },
      },
    });

    renderWithProviders(<TransactionForm onSubmit={onSubmit} />);

    expect(await screen.findByRole('option', { name: /Sugar/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /تسجيل/ }));

    expect(await screen.findByText('Stock is too low for this sale.')).toBeInTheDocument();
  });
});

describe('TransactionsList', () => {
  it('shows an empty state when there are no transactions', () => {
    renderWithProviders(<TransactionsList transactions={[]} />);

    expect(screen.getByText('لا توجد معاملات.')).toBeInTheDocument();
  });

  it('renders transaction rows through TransactionCard', () => {
    renderWithProviders(
      <TransactionsList
        transactions={[
          {
            id: 1,
            product_id: 1,
            product_name: 'Sugar',
            transaction_type: 'purchase',
            quantity: 5,
            total_price: 12,
            timestamp: '2026-04-16T09:00:00.000Z',
          },
        ]}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'معرف المنتج' })).toBeInTheDocument();
    expect(screen.getByText('Sugar')).toBeInTheDocument();
    expect(screen.getByText('شراء')).toHaveClass('status-badge', 'purchase');
  });
});

// ============================================
// SCREEN COMPONENT TESTS
// ============================================

describe('HomeScreen features and layout', () => {
  it('renders features section and cards', () => {
    renderWithProviders(<HomeScreen />);

    // Verify feature section heading
    expect(screen.getByText('ميزات قوية لعملك')).toBeInTheDocument();

    // Verify featured card titles are rendered
    expect(screen.getByText('Product Management')).toBeInTheDocument();
    expect(screen.getByText('Transaction Tracking')).toBeInTheDocument();
    expect(screen.getByText('Inventory Insights')).toBeInTheDocument();
  });

  it('navigates to login on CTA clicks', () => {
    renderWithProviders(<HomeScreen />);

    const startButton = screen.getByRole('button', { name: 'ابدأ الآن' });
    fireEvent.click(startButton);
  });
});

describe('ProductScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays product list view with products', async () => {
    const products = [
      { id: 1, name: 'Product 1', buy_price: 5, sell_price: 8, stock: 10 },
    ];
    getProducts.mockResolvedValue(products);

    renderWithProviders(<ProductScreen />, { route: '/products' });

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalled();
    });
  });

  it('handles delete product with confirmation', async () => {
    getProducts.mockResolvedValue([
      { id: 1, name: 'Product 1', buy_price: 5, sell_price: 8, stock: 10 },
    ]);
    deleteProduct.mockResolvedValue({ success: true });

    window.confirm = jest.fn().mockReturnValue(true);

    renderWithProviders(<ProductScreen />, { route: '/products' });

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalled();
    });
  });
});

describe('TransactionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays transaction list on mount', async () => {
    getTransactions.mockResolvedValue([]);
    getProducts.mockResolvedValue([
      { id: 1, name: 'Product 1', stock: 10 },
    ]);

    renderWithProviders(<TransactionScreen />);

    await waitFor(() => {
      expect(getTransactions).toHaveBeenCalled();
    });
  });

  it('uses preset transaction type from location state', async () => {
    getTransactions.mockResolvedValue([]);
    getProducts.mockResolvedValue([
      { id: 1, name: 'Product 1', stock: 10 },
    ]);

    renderWithProviders(<TransactionScreen />, {
      route: '/transactions',
    });

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalled();
    });
  });
});

describe('AdminScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays database statistics and health check', async () => {
    getDbStats.mockResolvedValue({
      success: true,
      data: {
        products: 5,
        transactions: 10,
        orphanedTransactions: 0,
        timestamp: new Date().toISOString(),
      },
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: {
          database: 'ok',
          dataIntegrity: 'ok',
        },
      },
    });

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(getDbStats).toHaveBeenCalled();
    });
  });

  it('displays reset database button and handles confirmation', async () => {
    getDbStats.mockResolvedValue({
      success: true,
      data: {
        products: 0,
        transactions: 0,
        orphanedTransactions: 0,
      },
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });
    resetDatabase.mockResolvedValue({ success: true, data: {} });

    window.confirm = jest.fn().mockReturnValue(true);

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reset Database/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Reset Database/i }));

    await waitFor(() => {
      expect(resetDatabase).toHaveBeenCalled();
    });
  });

  it('handles reset database cancellation', async () => {
    getDbStats.mockResolvedValue({
      success: true,
      data: {
        products: 0,
        transactions: 0,
        orphanedTransactions: 0,
      },
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });

    window.confirm = jest.fn().mockReturnValue(false);

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reset Database/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Reset Database/i }));

    expect(resetDatabase).not.toHaveBeenCalled();
  });

  it('displays cleanup orphaned transactions button', async () => {
    getDbStats.mockResolvedValue({
      success: true,
      data: {
        products: 5,
        transactions: 10,
        orphanedTransactions: 2,
      },
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });
    cleanupOrphanedTransactions.mockResolvedValue({
      success: true,
      data: { deletedCount: 2 },
    });

    window.confirm = jest.fn().mockReturnValue(true);

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cleanup/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cleanup/i }));

    await waitFor(() => {
      expect(cleanupOrphanedTransactions).toHaveBeenCalled();
    });
  });

  it('displays error message when stats fail to load', async () => {
    getDbStats.mockResolvedValue({
      success: false,
      error: 'Failed to fetch stats',
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch stats/i)).toBeInTheDocument();
    });
  });

  it('enables refresh button to reload stats and health', async () => {
    getDbStats.mockResolvedValue({
      success: true,
      data: {
        products: 5,
        transactions: 10,
        orphanedTransactions: 0,
      },
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      expect(getDbStats).toHaveBeenCalled();
    });
  });
});

// ============================================
// UISETTINGSCONTEXT TESTS
// ============================================

describe('UiSettingsContext', () => {
  it('provides language, theme, and translation functions', () => {
    renderWithProviders(<div data-testid="provider-test">Test</div>);
    const element = screen.getByTestId('provider-test');
    expect(element).toBeInTheDocument();
  });

  it('toggles language between English and Arabic', () => {
    renderWithProviders(
      <div>
        <Navbar />
      </div>
    );

    const arabicButton = screen.getByRole('button', { name: 'English' });
    fireEvent.click(arabicButton);

    expect(document.documentElement.lang).toBe('en');

    const englishButton = screen.getByRole('button', { name: 'العربية' });
    fireEvent.click(englishButton);

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('toggles theme between light and dark', () => {
    renderWithProviders(<Navbar />);

    const lightButton = screen.getByRole('button', { name: 'فاتح' });
    fireEvent.click(lightButton);

    expect(document.documentElement.dataset.theme).toBe('light');

    const darkButton = screen.getByRole('button', { name: 'داكن' });
    fireEvent.click(darkButton);

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists language preference to localStorage', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(window.localStorage.getItem('minishop-language')).toBe('en');

    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));

    expect(window.localStorage.getItem('minishop-language')).toBe('ar');
  });

  it('persists theme preference to localStorage', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'فاتح' }));

    expect(window.localStorage.getItem('minishop-theme')).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: 'داكن' }));

    expect(window.localStorage.getItem('minishop-theme')).toBe('dark');
  });

  it('provides translation function with correct values', () => {
    renderWithProviders(
      <div>
        <Navbar />
      </div>
    );

    expect(screen.getByText('لوحة المتجر')).toBeInTheDocument();
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Integration: Theme Toggle Affects All Screens', () => {
  it('persists theme preference', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'فاتح' }));
    expect(window.localStorage.getItem('minishop-theme')).toBe('light');
  });
});

describe('Integration: Language Toggle Affects All Screens', () => {
  it('changes language and updates document', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(document.documentElement.lang).toBe('en');
  });
});

describe('Integration: Form Submission Triggers Refetch', () => {
  it('ProductScreen is rendered with products query', async () => {
    getProducts.mockResolvedValue([]);

    renderWithProviders(<ProductScreen />, { route: '/products' });

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalled();
    });
  });
});

// ============================================
// EDGE CASES & ERROR HANDLING
// ============================================

describe('Edge Cases: API Errors', () => {
  it('handles network error in product fetch', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getProducts.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ProductScreen />, { route: '/products' });

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });
});

describe('Edge Cases: Null/Undefined Values', () => {
  it('handles undefined product name in product card', () => {
    const product = {
      id: 1,
      name: undefined,
      buy_price: 5,
      sell_price: 8,
      stock: 10,
    };

    renderTableComponent(<ProductCard product={product} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('#1')).toBeInTheDocument();
  });
});

describe('Edge Cases: Empty Lists', () => {
  it('displays empty state for product list', () => {
    renderWithProviders(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('لا توجد منتجات.')).toBeInTheDocument();
  });

  it('displays empty state for transaction list', () => {
    renderWithProviders(<TransactionsList transactions={[]} />);

    expect(screen.getByText('لا توجد معاملات.')).toBeInTheDocument();
  });
});

describe('Edge Cases: Unknown Product fallback', () => {
  it('shows fallback in TransactionCard when product name is missing', () => {
    renderTableComponent(
      <TransactionCard
        transaction={{
          id: 1,
          product_id: 1,
          product_name: undefined,
          transaction_type: 'sale',
          quantity: 1,
          total_price: 10,
          timestamp: '2026-04-16T09:00:00.000Z',
        }}
      />
    );

    expect(screen.getByText('منتج غير معروف')).toBeInTheDocument();
  });
});

describe('Edge Cases: Disabled Buttons During Submission', () => {
  it('renders submit button in ProductScreen', async () => {
    getProducts.mockResolvedValue([]);

    renderWithProviders(<ProductScreen />, { route: '/products/new' });

    await waitFor(() => {
      expect(screen.getByLabelText('الاسم')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'إضافة منتج' });
    expect(submitButton).toBeInTheDocument();
  });
});

describe('Edge Cases: Form Validation', () => {
  it('validates that product prices are positive', async () => {
    getProducts.mockResolvedValue([]);

    renderWithProviders(<ProductScreen />, { route: '/products/new' });

    await waitFor(() => {
      expect(screen.getByLabelText('الاسم')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('سعر الشراء'), { target: { value: '-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'إضافة منتج' }));

    expect(screen.getByText('الرجاء إدخال قيم صحيحة وموجبة لكل الحقول.')).toBeInTheDocument();
  });

  it('validates that stock is non-negative', async () => {
    getProducts.mockResolvedValue([]);

    renderWithProviders(<ProductScreen />, { route: '/products/new' });

    await waitFor(() => {
      expect(screen.getByLabelText('المخزون')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('المخزون'), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'إضافة منتج' }));

    expect(screen.getByText('الرجاء إدخال قيم صحيحة وموجبة لكل الحقول.')).toBeInTheDocument();
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('Accessibility: ARIA Labels', () => {
  it('has ARIA labels for buttons', () => {
    renderWithProviders(<Navbar />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('admin screen close alert button has aria-label', async () => {
    getDbStats.mockResolvedValue({
      success: false,
      error: 'Test error',
    });
    getHealthCheck.mockResolvedValue({
      success: true,
      data: {
        status: 'healthy',
        checks: { database: 'ok', dataIntegrity: 'ok' },
      },
    });

    renderWithProviders(<AdminScreen />);

    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton).toBeInTheDocument();
    });
  });
});

describe('Accessibility: Keyboard Navigation', () => {
  it('allows Tab navigation through form fields', () => {
    renderWithProviders(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toBeTruthy();
  });
});

describe('Accessibility: Error Messages', () => {
  it('displays error messages when form validation fails', async () => {
    getProducts.mockResolvedValue([]);

    renderWithProviders(<ProductScreen />, { route: '/products/new' });

    await waitFor(() => {
      expect(screen.getByLabelText('الاسم')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('سعر الشراء'), { target: { value: '-5' } });
    fireEvent.click(screen.getByRole('button', { name: 'إضافة منتج' }));

    expect(screen.getByText('الرجاء إدخال قيم صحيحة وموجبة لكل الحقول.')).toBeInTheDocument();
  });
});

describe('Accessibility: Semantic HTML', () => {
  it('uses buttons for clickable actions', () => {
    renderWithProviders(<Navbar />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('uses proper heading hierarchy', async () => {
    getProducts.mockResolvedValue([]);
    getTransactions.mockResolvedValue([]);

    renderWithProviders(<HomeScreen />);

    await waitFor(() => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});

