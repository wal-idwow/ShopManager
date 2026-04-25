/**
 * TransactionsList Component
 * 
 * Responsibilities:
 * - Display a list of transactions using the `TransactionCard` component.
 * - Render a message if no transactions are available.
 * 
 * Props:
 * - `transactions`: Array of transaction objects to display.
 */

import React from 'react'; // Import React for creating the component
import TransactionCard from './transactionsCard'; // Import TransactionCard component to display individual transaction details
import { useUiSettings } from '../context/UiSettingsContext';

const TransactionsList = ({ transactions }) => {
    const { t } = useUiSettings(); // Access translation function from UI settings context

    // If there are no transactions to display, show a message indicating that no transactions were found
    if (!transactions || transactions.length === 0) {
        return <p className="empty-state">{t('noTransactionsFound')}</p>;
    }

    return (
        <div className="table-shell">
            <table className="data-table">
                <thead>
                    <tr>
                        {/* Table headers for transaction details */}
                        <th>{t('id')}</th>
                        <th>{t('date')}</th>
                        <th>{t('product')}</th>
                        <th>{t('productId')}</th>
                        <th>{t('type')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render a TransactionCard for each transaction in the list */}
                    {transactions.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsList;

