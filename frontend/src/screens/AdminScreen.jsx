/**
 * AdminScreen Component
 * 
 * Provides administrative interface for:
 * - Database statistics and monitoring
 * - Health checks and data integrity verification
 * - Database reset and cleanup operations
 * 
 * Features:
 * - Real-time database statistics
 * - Health status indicator
 * - Destructive operation warnings
 * - Operation history/feedback
 */

import React, { useState, useEffect } from 'react';
import { useUiSettings } from '../context/UiSettingsContext';
import {
  resetDatabase,
  getDbStats,
  cleanupOrphanedTransactions,
  getHealthCheck,
} from '../services/adminApi';
import '../styles/admin.css';

const AdminScreen = () => {
  const { t, theme } = useUiSettings();

  // State for statistics
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // State for health check
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // State for operations
  const [operationResult, setOperationResult] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchStats();
      await fetchHealth();
    };
    loadInitialData();
  }, []);

  /**
   * Fetch database statistics
   */
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const result = await getDbStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setOperationResult({
          type: 'error',
          message: `Failed to fetch stats: ${result.error}`,
        });
      }
    } catch (error) {
      setOperationResult({
        type: 'error',
        message: `Error fetching stats: ${error.message}`,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * Fetch health check
   */
  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const result = await getHealthCheck();
      if (result.success) {
        setHealth(result.data);
      } else {
        setOperationResult({
          type: 'error',
          message: `Failed to fetch health: ${result.error}`,
        });
      }
    } catch (error) {
      setOperationResult({
        type: 'error',
        message: `Error fetching health: ${error.message}`,
      });
    } finally {
      setHealthLoading(false);
    }
  };

  /**
   * Handle database reset with confirmation
   */
  const handleResetDatabase = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will DELETE ALL products and transactions. This action CANNOT be undone!\n\nAre you sure you want to proceed?'
    );

    if (!confirmed) {
      setOperationResult({
        type: 'info',
        message: 'Database reset cancelled.',
      });
      return;
    }

    setOperationLoading(true);
    try {
      const result = await resetDatabase();
      if (result.success) {
        setOperationResult({
          type: 'success',
          message: '✅ Database reset successfully. All records cleared and ID generators reset.',
        });
        // Refresh stats and health
        await fetchStats();
        await fetchHealth();
      } else {
        setOperationResult({
          type: 'error',
          message: `Failed to reset database: ${result.error}`,
        });
      }
    } catch (error) {
      setOperationResult({
        type: 'error',
        message: `Error resetting database: ${error.message}`,
      });
    } finally {
      setOperationLoading(false);
    }
  };

  /**
   * Handle cleanup orphaned transactions
   */
  const handleCleanup = async () => {
    const confirmed = window.confirm(
      'This will remove any orphaned transactions (transactions referencing deleted products).\n\nProceed?'
    );

    if (!confirmed) {
      setOperationResult({
        type: 'info',
        message: 'Cleanup cancelled.',
      });
      return;
    }

    setOperationLoading(true);
    try {
      const result = await cleanupOrphanedTransactions();
      if (result.success) {
        const deleted = result.data.deletedCount || 0;
        setOperationResult({
          type: 'success',
          message:
            deleted === 0
              ? '✅ Cleanup completed. No orphaned transactions found.'
              : `✅ Cleanup completed. ${deleted} orphaned transaction(s) removed.`,
        });
        // Refresh stats and health
        await fetchStats();
        await fetchHealth();
      } else {
        setOperationResult({
          type: 'error',
          message: `Failed to cleanup: ${result.error}`,
        });
      }
    } catch (error) {
      setOperationResult({
        type: 'error',
        message: `Error during cleanup: ${error.message}`,
      });
    } finally {
      setOperationLoading(false);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    await fetchStats();
    await fetchHealth();
    setOperationResult({
      type: 'info',
      message: 'Data refreshed.',
    });
  };

  return (
    <div className={`admin-screen admin-${theme}`}>
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <h2>{t('admin') || 'Admin Panel'}</h2>
          <p className="admin-subtitle">Database management and monitoring</p>
        </div>

        {/* Operation Result Alert */}
        {operationResult && (
          <div className={`admin-alert admin-alert-${operationResult.type}`}>
            <div className="admin-alert-content">
              <p>{operationResult.message}</p>
              <button
                className="admin-alert-close"
                onClick={() => setOperationResult(null)}
                aria-label="Close alert"
                title="Close message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="admin-content">
          {/* Left Column: Statistics & Health */}
          <div className="admin-left">
            {/* Database Statistics Card */}
            <div className="admin-card admin-stats-card">
              <div className="admin-card-header">
                <h3>📊 Database Statistics</h3>
                <button
                  className="admin-btn-small admin-btn-refresh"
                  onClick={handleRefresh}
                  disabled={statsLoading || healthLoading || operationLoading}
                  title="Refresh data"
                >
                  🔄
                </button>
              </div>

              {statsLoading ? (
                <div className="admin-loading">Loading statistics...</div>
              ) : stats ? (
                <div className="admin-stats">
                  <div className="admin-stat-item">
                    <span className="admin-stat-label">Products:</span>
                    <span className="admin-stat-value">{stats.products || 0}</span>
                  </div>
                  <div className="admin-stat-item">
                    <span className="admin-stat-label">Transactions:</span>
                    <span className="admin-stat-value">{stats.transactions || 0}</span>
                  </div>
                  <div className="admin-stat-item">
                    <span className="admin-stat-label">Orphaned Transactions:</span>
                    <span className="admin-stat-value orphaned">
                      {stats.orphanedTransactions || 0}
                    </span>
                  </div>
                  {stats.timestamp && (
                    <div className="admin-stat-timestamp">
                      {new Date(stats.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-error">Failed to load statistics</div>
              )}
            </div>

            {/* Health Check Card */}
            <div className="admin-card admin-health-card">
              <div className="admin-card-header">
                <h3>❤️ System Health</h3>
              </div>

              {healthLoading ? (
                <div className="admin-loading">Checking health...</div>
              ) : health ? (
                <div className="admin-health">
                  <div className="admin-health-status">
                    <span className={`admin-status-indicator status-${health.status}`}>
                      {health.status.toUpperCase()}
                    </span>
                  </div>

                  {health.checks && (
                    <div className="admin-checks">
                      <div className="admin-check-item">
                        <span className="admin-check-label">Database:</span>
                        <span className={`admin-check-value status-${health.checks.database}`}>
                          {health.checks.database}
                        </span>
                      </div>
                      <div className="admin-check-item">
                        <span className="admin-check-label">Data Integrity:</span>
                        <span
                          className={`admin-check-value status-${health.checks.dataIntegrity}`}
                        >
                          {health.checks.dataIntegrity}
                        </span>
                      </div>
                    </div>
                  )}

                  {health.recommendations && health.recommendations.length > 0 && (
                    <div className="admin-recommendations">
                      <p className="admin-recommendations-title">Recommendations:</p>
                      <ul>
                        {health.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-error">Failed to load health check</div>
              )}
            </div>
          </div>

          {/* Right Column: Operations */}
          <div className="admin-right">
            {/* Operations Card */}
            <div className="admin-card admin-operations-card">
              <div className="admin-card-header">
                <h3>⚙️ Database Operations</h3>
              </div>

              <div className="admin-operations">
                {/* Reset Database Button */}
                <div className="admin-operation-group">
                  <h4>Database Reset</h4>
                  <p className="admin-operation-description">
                    Clear all products and transactions. Reset ID generators to start fresh. This
                    action cannot be undone.
                  </p>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={handleResetDatabase}
                    disabled={operationLoading}
                    title="Delete all products and transactions"
                  >
                    {operationLoading ? '⏳ Processing...' : '🗑️ Reset Database'}
                  </button>
                </div>

                <div className="admin-operation-divider"></div>

                {/* Cleanup Button */}
                <div className="admin-operation-group">
                  <h4>Cleanup Orphaned Transactions</h4>
                  <p className="admin-operation-description">
                    Remove any transactions that reference deleted products. This ensures data
                    integrity.
                  </p>
                  <button
                    className="admin-btn admin-btn-warning"
                    onClick={handleCleanup}
                    disabled={operationLoading}
                    title="Remove orphaned transactions"
                  >
                    {operationLoading ? '⏳ Processing...' : '🧹 Cleanup'}
                  </button>
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className="admin-card admin-info-card">
              <div className="admin-card-header">
                <h3>ℹ️ Information</h3>
              </div>

              <div className="admin-info">
                <div className="admin-info-section">
                  <h4>Database Features</h4>
                  <ul>
                    <li>✅ Automatic ID reset on database reset</li>
                    <li>✅ Cascade delete prevents orphaned transactions</li>
                    <li>✅ Product names preserved in transaction history</li>
                    <li>✅ Real-time health monitoring</li>
                  </ul>
                </div>

                <div className="admin-info-section">
                  <h4>Safety Features</h4>
                  <ul>
                    <li>⚠️ Confirmation required for destructive operations</li>
                    <li>⚠️ All operations logged with timestamps</li>
                    <li>⚠️ Health checks performed automatically</li>
                    <li>⚠️ Orphaned record detection built-in</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
