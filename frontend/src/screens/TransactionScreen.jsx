/**
 * TransactionScreen Component
 *
 * Responsibilities:
 * - Display a list of transactions using the `TransactionsList` component.
 * - Provide a form for creating new transactions using the `TransactionForm` component.
 * - Fetch and manage transaction data from the API.
 * - Handle the submission of new transactions and update the transaction list.
 *
 * Features:
 * - Controlled form fields for transaction details (product name, quantity, type, total, date).
 * - Auto-fill the date field with the current date and time.
 * - Calculate the total based on quantity and product price.
 * - Redirect to the transaction list after successful submission.
 */

import React, { useState, useEffect } from 'react'; // Import React and necessary hooks for managing state and side effects
import { useLocation } from 'react-router-dom';
import TransactionsList from '../components/transactionsList'; // Import TransactionsList component to display the list of transactions
import { TransactionForm } from '../components/transactionsCard'; // Import TransactionForm component to handle the transaction form
import { createTransaction, getTransactions } from '../services/api'; // Import API functions for transaction operations
import { useUiSettings } from '../context/UiSettingsContext';

// TransactionScreen component to manage transactions and display the list of transactions
const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]); // State to hold the list of transactions
  const location = useLocation(); // Hook to access the current location and state
  const { t } = useUiSettings(); // Access translation function from UI settings context

  // Fetch transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(); // Fetch transactions from the API
        setTransactions(data); // Update the transactions state with the fetched data
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle the submission of a new transaction
  const handleSubmit = async (transactionData) => {
    try {
      await createTransaction(transactionData); // Add a new transaction to the system using the API
      const updatedTransactions = await getTransactions(); // Fetch the updated transaction list
      setTransactions(updatedTransactions); // Update the transactions state
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error; // Rethrow the error to handle it in the form component if needed
    }
  };

  return (
    <section className="page-section">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">{t('salesFlow')}</p>
          <h2>{t('transactionList')}</h2>
        </div>
      </div>
      {/* Render the TransactionForm component for adding new transactions */}
      <TransactionForm
        onSubmit={handleSubmit}
        initialType={location.state?.presetType || 'purchase'} // Default to 'purchase' if no preset type is provided
        title={t('addTransaction')}
      />
      {/* Render the TransactionsList component to display the list of transactions */}
      <TransactionsList transactions={transactions} />
    </section>
  );
};

export default TransactionScreen; // Export the TransactionScreen component for use in other parts of the application
