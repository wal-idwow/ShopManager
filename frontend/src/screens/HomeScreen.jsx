/**
 * HomeScreen Component
 *
 * Responsibilities:
 * - Serve as a modern landing page for unauthenticated users
 * - Display hero section with CTA buttons
 * - Showcase features with modern cards
 * - Pure UI component - NO routing/redirect logic
 *
 * Features:
 * - Hero section with app name and login/register buttons
 * - Three feature cards highlighting core functionality
 * - Responsive design with open-source images
 * - All navigation delegated to button handlers
 *
 * Note:
 * - Routing guards are handled by PublicRoute wrapper in App.jsx
 * - This component is NOT responsible for redirecting authenticated users
 */

import React from 'react';
import { useUiSettings } from '../context/UiSettingsContext';
import { useNavigate } from 'react-router-dom';

// Feature definitions for landing page
const features = [
  {
    id: 'products',
    icon: '📦',
    title: 'Product Management',
    description: 'Manage your inventory with ease. Add, edit, and track all your products in one centralized location.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop',
  },
  {
    id: 'transactions',
    icon: '📊',
    title: 'Transaction Tracking',
    description: 'Keep detailed records of all your purchases and sales. Monitor every transaction with comprehensive history.',
    image: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=500&h=300&fit=crop',
  },
  {
    id: 'insights',
    icon: '💡',
    title: 'Inventory Insights',
    description: 'Get real-time analytics and insights about your inventory. Make data-driven decisions for your business.',
    image: 'https://images.unsplash.com/photo-1516534775068-bb555c6feece?w=500&h=300&fit=crop',
  },
];

/**
 * HomeScreen component - Landing page UI
 * 
 * Pure presentation component with no side effects or routing logic.
 * All navigation is explicit through onClick handlers.
 */
const HomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useUiSettings();
  // Render landing page for unauthenticated users
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨ {t('welcome')} </span>
            </div>
            <h1 className="hero-title">{t('appName')}</h1>
            <p className="hero-subtitle">
              {t('welcomingPhrase')}
            </p>
            <div className="hero-ctas">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/login')}
              >
                {t('login')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/login')}
              >
                {t('register')}
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
              alt="Shop Manager Dashboard"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>{t('homeTitleH2')}</h2>
            <p>{t('subTitle')}</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <article key={feature.id} className="feature-card-modern">
                <div className="feature-image-wrapper">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="feature-image"
                  />
                  <div className="feature-overlay">
                    <span className="feature-icon">{feature.icon}</span>
                  </div>
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>{t('readyToGetStarted')}</h2>
          <p>{t('joinThousands')}</p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login')}
          >
            {t('getStartedNow')}
          </button>
        </div>
      </section>
    </div>
  );
};

// Export the HomeScreen component
export default HomeScreen;
