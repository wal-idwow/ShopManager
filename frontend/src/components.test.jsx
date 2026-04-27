import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductList from './components/ProductList';
import TransactionCard, { TransactionForm } from './components/transactionsCard';
import TransactionsList from './components/transactionsList';
import { UiSettingsProvider } from './context/UiSettingsContext';
import { getProductById, getProducts } from './services/api';

jest.mock('./services/api', () => ({
  getProductById: jest.fn(),
  getProducts: jest.fn(),
}));

const renderWithProviders = (ui, { route = '/' } = {}) =>
  render(
    <UiSettingsProvider>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </UiSettingsProvider>
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
});

describe('Navbar', () => {
  it('renders translated content, navigation links, and active route styling', () => {
    renderWithProviders(<Navbar />, { route: '/products' });

    expect(screen.getByText('Retail Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '7anouti' })).toBeInTheDocument();
    expect(screen.getByText('7anouti: my small shop, always close.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'العربية' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toHaveClass('active');
  });

  it('toggles language and theme from the provider', () => {
    renderWithProviders(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));
    expect(document.documentElement.lang).toBe('ar');
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
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

  it('renders product details and invokes edit/delete callbacks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderTableComponent(<ProductCard product={product} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('Mint Tea')).toBeInTheDocument();
    expect(screen.getByText('$4.00')).toBeInTheDocument();
    expect(screen.getByText('$6.50')).toBeInTheDocument();
    expect(screen.getByText('3 in stock')).toHaveClass('status-badge', 'low');

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onEdit).toHaveBeenCalledWith(product);
    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it('uses the healthy stock style for well-stocked products', () => {
    renderTableComponent(
      <ProductCard
        product={{ ...product, id: 8, stock: 12 }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('12 in stock')).toHaveClass('status-badge', 'healthy');
  });
});

describe('ProductList', () => {
  const products = [
    { id: 1, name: 'Sugar', buy_price: 2, sell_price: 3, stock: 10 },
    { id: 2, name: 'Coffee', buy_price: 5, sell_price: 7, stock: 4 },
  ];

  it('shows an empty state when no products are available', () => {
    renderWithProviders(<ProductList products={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  it('renders table headers and product rows', () => {
    renderWithProviders(
      <ProductList products={products} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByText('Sugar')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
  });
});

describe('TransactionCard', () => {
  const transaction = {
    id: 9,
    product_id: 4,
    transaction_type: 'sale',
    quantity: 2,
    total_price: 19.5,
    timestamp: '2026-04-17T12:00:00.000Z',
  };

  it('returns null when no transaction is provided', () => {
    const { container } = renderTableComponent(<TransactionCard transaction={null} />);

    expect(container.querySelector('tbody')).toBeEmptyDOMElement();
  });

  it('loads and displays the related product name', async () => {
    getProductById.mockResolvedValue({ id: 4, name: 'Olive Oil' });

    renderTableComponent(<TransactionCard transaction={transaction} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Olive Oil')).toBeInTheDocument();
    expect(getProductById).toHaveBeenCalledWith(4);
    expect(screen.getByText('Sale')).toHaveClass('status-badge', 'sale');
    expect(screen.getByText('$19.50')).toBeInTheDocument();
    expect(
      screen.getByText(new Date(transaction.timestamp).toLocaleDateString())
    ).toBeInTheDocument();
  });

  it('falls back to the unknown-product label when the product lookup fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getProductById.mockRejectedValue(new Error('lookup failed'));

    renderTableComponent(<TransactionCard transaction={transaction} />);

    expect(await screen.findByText('Unknown product')).toBeInTheDocument();

    errorSpy.mockRestore();
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
    expect(await screen.findByRole('option', { name: 'Sugar (8 in stock)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Make Sale' })).toBeEnabled();

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Coffee' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Make Sale' }).closest('form'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        product_name: 'Coffee',
        quantity: 4,
        transaction_type: 'sale',
      });
    });

    await waitFor(() => expect(getProducts).toHaveBeenCalledTimes(2));
    expect(screen.getByLabelText('Quantity')).toHaveValue(1);
  });

  it('validates that quantity is greater than zero', async () => {
    const onSubmit = jest.fn();
    getProducts.mockResolvedValue(productOptions);

    renderWithProviders(<TransactionForm onSubmit={onSubmit} />);

    expect(await screen.findByRole('option', { name: 'Sugar (8 in stock)' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Make Purchase' }).closest('form'));

    expect(screen.getByText('Quantity must be greater than zero.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a load error and disables submit when products cannot be fetched', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getProducts.mockRejectedValue(new Error('network down'));

    renderWithProviders(<TransactionForm onSubmit={jest.fn()} />);

    expect(await screen.findByText('Unable to load products.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Make Purchase' })).toBeDisabled();

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

    expect(await screen.findByRole('option', { name: 'Sugar (8 in stock)' })).toBeInTheDocument();
    fireEvent.submit(screen.getByRole('button', { name: 'Make Purchase' }).closest('form'));

    expect(await screen.findByText('Stock is too low for this sale.')).toBeInTheDocument();
  });
});

describe('TransactionsList', () => {
  it('shows an empty state when there are no transactions', () => {
    renderWithProviders(<TransactionsList transactions={[]} />);

    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });

  it('renders transaction rows through TransactionCard', async () => {
    getProductById.mockResolvedValue({ id: 1, name: 'Sugar' });

    renderWithProviders(
      <TransactionsList
        transactions={[
          {
            id: 1,
            product_id: 1,
            transaction_type: 'purchase',
            quantity: 5,
            total_price: 12,
            timestamp: '2026-04-16T09:00:00.000Z',
          },
        ]}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Product ID' })).toBeInTheDocument();
    expect(await screen.findByText('Sugar')).toBeInTheDocument();
    expect(screen.getByText('Purchase')).toHaveClass('status-badge', 'purchase');
  });
});
