import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function HomePage() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    const features = document.querySelectorAll('.feature-card');
    features.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <>
      
      <div className="homepage">
        <section className="hero-section">
          <div className="container hero-container text-center">
            <h1 className="hero-title">
              Automate Your Social Media Marketing
            </h1>
            <p className="hero-subtitle">
              AI-powered content creation and scheduling for businesses. Streamline your social presence with enterprise-grade tools.
            </p>

            <div className="cta-buttons">
              {isSignedIn ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ): (
                <Link to="/sign-in" className="btn btn-primary">
                  Get Started
                </Link>
              )}
            </div>

            <div className="features-grid">
              <div className="feature-card floating">
                <div className="feature-icon">🤖</div>
                <h3 className="feature-title">AI Content Generation</h3>
                <p className="feature-description">
                  Create compelling posts with our AI assistant that understands your brand voice.
                </p>
              </div>

              <div className="feature-card floating">
                <div className="feature-icon">📅</div>
                <h3 className="feature-title">Smart Scheduling</h3>
                <p className="feature-description">
                  Automate posting to multiple platforms with intelligent timing.
                </p>
              </div>

              <div className="feature-card floating">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Performance Tracking</h3>
                <p className="feature-description">
                  Monitor content history and engagement to optimize your strategy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        :root {
          --primary: #4361ee;
          --accent: #4cc9f0;
          --darker: #0f172a;
          --light: #f8f9fa;
          --glass-bg: rgba(255, 255, 255, 0.85);
          --shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          --border-radius: 12px;
          --transition: all 0.3s ease;
        }

        .homepage {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #f0f4ff, #e0f7fa);
          padding: 3rem 1rem;
          min-height: 100vh;
          color: var(--darker);
        }

        .hero-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .text-center {
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          color: #555;
        }

        .cta-buttons .btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
          text-decoration: none;
        }

        .cta-buttons .btn:hover {
          background: var(--accent);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-card {
          background: var(--glass-bg);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 2rem;
          transition: var(--transition);
          animation: floatIn 0.8s ease forwards;
          opacity: 0;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-description {
          font-size: 1rem;
          color: #333;
        }

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
