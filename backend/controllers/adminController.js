/**
 * Admin Controller
 *
 * Responsibilities:
 * - Handle administrative database operations
 * - Database reset and cleanup operations
 * - Database statistics and monitoring
 * - Data integrity checks
 *
 * Functions:
 * - `resetDatabase(req, res)`: Clear all records and reset ID generators
 * - `getDbStats(req, res)`: Get database statistics
 * - `cleanupOrphanedTransactions(req, res)`: Remove orphaned transaction records
 */

const db = require('../database/database');

// Controller function to reset the entire database
exports.resetDatabase = async (req, res) => {
  try {
    // Security: Add optional password/token check in production
    const result = db.resetDatabase();
    
    res.status(200).json({
      message: 'Database reset successfully',
      details: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).json({ 
      error: 'Failed to reset database',
      details: err.message 
    });
  }
};

// Controller function to get database statistics
exports.getDbStats = async (req, res) => {
  try {
    const stats = db.getDbStats();
    
    res.status(200).json({
      message: 'Database statistics retrieved',
      data: stats,
    });
  } catch (err) {
    console.error('Error getting database stats:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve database statistics',
      details: err.message 
    });
  }
};

// Controller function to cleanup orphaned transactions
exports.cleanupOrphanedTransactions = async (req, res) => {
  try {
    const result = db.cleanupOrphanedTransactions();
    
    res.status(200).json({
      message: 'Orphaned transactions cleaned up',
      details: {
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Error cleaning orphaned transactions:', err);
    res.status(500).json({ 
      error: 'Failed to cleanup orphaned transactions',
      details: err.message 
    });
  }
};

/**
 * Database health check - returns overall database integrity status
 */
exports.healthCheck = async (req, res) => {
  try {
    const stats = db.getDbStats();
    
    const isHealthy = stats.orphanedTransactions === 0;
    const status = isHealthy ? 'healthy' : 'warning';
    
    res.status(200).json({
      status: status,
      checks: {
        database: 'connected',
        productsCount: stats.products,
        transactionsCount: stats.transactions,
        orphanedTransactions: stats.orphanedTransactions,
        dataIntegrity: isHealthy ? 'ok' : 'issues detected',
      },
      recommendations: isHealthy ? [] : [
        'Run /api/admin/cleanup to remove orphaned transactions'
      ],
      timestamp: stats.timestamp,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: 'Health check failed',
      details: err.message,
    });
  }
};
