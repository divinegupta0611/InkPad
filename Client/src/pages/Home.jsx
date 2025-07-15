import React, { useState, useEffect } from 'react';
import {Outlet,Link} from 'react-router-dom'
import { ArrowRight, Users, Zap, Globe, Play, CheckSquare } from 'lucide-react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Users size={24} />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team"
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Instant updates and smooth performance"
    },
    {
      icon: <Globe size={24} />,
      title: "Access Anywhere",
      description: "Work from any device, anywhere"
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'white',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    backgroundElements: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1
    },
    backgroundCircle1: {
      position: 'absolute',
      width: '384px',
      height: '384px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      transition: 'all 1s ease-out',
      left: `${mousePosition.x * 0.02}%`,
      top: `${mousePosition.y * 0.02}%`,
    },
    backgroundCircle2: {
      position: 'absolute',
      width: '320px',
      height: '320px',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      transition: 'all 1s ease-out',
      right: `${mousePosition.x * 0.01}%`,
      bottom: `${mousePosition.y * 0.01}%`,
    },
    nav: {
      position: 'relative',
      zIndex: 10,
      padding: '24px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-16px)',
      transition: 'all 0.8s ease-out'
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #3b82f6, #f97316)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoIconInner: {
      width: '16px',
      height: '16px',
      backgroundColor: 'white',
      borderRadius: '4px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap'
    },
    navLink: {
      color: '#6b7280',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      border: 'none',
      background: 'none',
      fontSize: '16px'
    },
    navLinkHover: {
      color: '#3b82f6'
    },
    signInBtn: {
      padding: '8px 16px',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-block'
    },
    primaryBtn: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-block'
    },
    taskBtn: {
      padding: '8px 16px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    main: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 24px 128px'
    },
    heroSection: {
      textAlign: 'center',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 1s ease-out 0.2s'
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '24px',
      lineHeight: '1.2'
    },
    heroTitleGradient: {
      display: 'block',
      background: 'linear-gradient(135deg, #3b82f6, #f97316)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heroDescription: {
      fontSize: '20px',
      color: '#6b7280',
      marginBottom: '48px',
      maxWidth: '600px',
      margin: '0 auto 48px',
      lineHeight: '1.6'
    },
    heroButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '64px',
      flexWrap: 'wrap'
    },
    heroPrimaryBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    heroTaskBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    heroSecondaryBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      backgroundColor: 'transparent',
      color: '#374151',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    previewSection: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(48px)',
      transition: 'all 1s ease-out 0.4s'
    },
    whiteboardPreview: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden'
    },
    previewHeader: {
      height: '48px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    },
    previewDots: {
      display: 'flex',
      gap: '8px'
    },
    previewDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    previewTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280'
    },
    previewCanvas: {
      height: '400px',
      background: 'linear-gradient(135deg, #eff6ff, #fff7ed)',
      position: 'relative'
    },
    canvasElement: {
      position: 'absolute',
      borderRadius: '8px',
      opacity: 0.6
    },
    cursor: {
      position: 'absolute',
      width: '16px',
      height: '16px',
      borderRadius: '50%'
    },
    cursorLabel: {
      position: 'absolute',
      top: '-32px',
      left: '-8px',
      fontSize: '12px',
      fontWeight: '500'
    },
    featuresSection: {
      marginTop: '128px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 1s ease-out 0.6s'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px'
    },
    featureCard: {
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #f3f4f6',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    featureIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #dbeafe, #fed7aa)',
      borderRadius: '12px',
      marginBottom: '16px',
      color: '#3b82f6',
      transition: 'transform 0.3s ease'
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    featureDescription: {
      color: '#6b7280',
      lineHeight: '1.6'
    },
    footer: {
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid #f3f4f6',
      padding: '32px 0'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      textAlign: 'center',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Elements */}
      <div style={styles.backgroundElements}>
        <div style={styles.backgroundCircle1} />
        <div style={styles.backgroundCircle2} />
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <div style={styles.logoIconInner}></div>
            </div>
            <span style={styles.logoText}>SyncPad</span>
          </div>
          
          <div style={styles.navLinks}>
            <button 
              style={styles.navLink}
              onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
              onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
            >
              Features
            </button>
            <button 
              style={styles.navLink}
              onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
              onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
            >
              Pricing
            </button>
            <button 
              style={styles.signInBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Sign In
            </button>
            <Link 
              to='/room'
              style={styles.primaryBtn}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Getting Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={styles.main}>
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Collaborate
            <span style={styles.heroTitleGradient}>Visually</span>
          </h1>
          
          <p style={styles.heroDescription}>
            Transform your ideas into reality with our intuitive collaborative whiteboard. 
            Create, share, and innovate together in real-time.
          </p>

          <div style={styles.heroButtons}>
            <button 
              style={styles.heroPrimaryBtn}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span><Link to='/room' style={{color: 'white', textDecoration: 'none'}}>Start Creating</Link></span>
              <ArrowRight size={20} />
            </button>
            <button 
              style={styles.heroSecondaryBtn}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Play size={20} />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Whiteboard Preview */}
        <div style={styles.previewSection}>
          <div style={styles.whiteboardPreview}>
            <div style={styles.previewHeader}>
              <div style={styles.previewDots}>
                <div style={{...styles.previewDot, backgroundColor: '#ef4444'}}></div>
                <div style={{...styles.previewDot, backgroundColor: '#eab308'}}></div>
                <div style={{...styles.previewDot, backgroundColor: '#22c55e'}}></div>
              </div>
              <div style={styles.previewTitle}>
                <span>Untitled Board</span>
              </div>
            </div>
            
            <div style={styles.previewCanvas}>
              {/* Simulated whiteboard elements */}
              <div style={{
                ...styles.canvasElement,
                top: '32px',
                left: '32px',
                width: '128px',
                height: '80px',
                backgroundColor: '#bfdbfe',
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{
                ...styles.canvasElement,
                top: '64px',
                right: '64px',
                width: '96px',
                height: '96px',
                backgroundColor: '#fed7aa',
                borderRadius: '50%',
                animationDelay: '0.3s',
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{
                ...styles.canvasElement,
                bottom: '48px',
                left: '80px',
                width: '160px',
                height: '8px',
                backgroundColor: '#d1d5db',
                borderRadius: '4px',
                animationDelay: '0.5s',
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{
                ...styles.canvasElement,
                bottom: '32px',
                left: '80px',
                width: '112px',
                height: '8px',
                backgroundColor: '#d1d5db',
                borderRadius: '4px',
                animationDelay: '0.7s',
                animation: 'pulse 2s infinite'
              }}></div>
              
              {/* Floating cursors */}
              <div style={{
                ...styles.cursor,
                top: '96px',
                left: '128px',
                backgroundColor: '#3b82f6',
                animation: 'bounce 1s infinite'
              }}>
                <div style={{...styles.cursorLabel, color: '#3b82f6'}}>Alex</div>
              </div>
              <div style={{
                ...styles.cursor,
                top: '160px',
                right: '128px',
                backgroundColor: '#f97316',
                animationDelay: '0.3s',
                animation: 'bounce 1s infinite'
              }}>
                <div style={{...styles.cursorLabel, color: '#f97316'}}>Sarah</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#bfdbfe';
                  e.currentTarget.querySelector('.feature-icon').style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#f3f4f6';
                  e.currentTarget.querySelector('.feature-icon').style.transform = 'scale(1)';
                }}
              >
                <div className="feature-icon" style={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 style={styles.featureTitle}>
                  {feature.title}
                </h3>
                <p style={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>&copy; 2025 WhiteBoard. Made with ❤️ for creative minds.</p>
        </div>
      </footer>
      <Outlet/>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem !important;
          }
          .hero-description {
            font-size: 18px !important;
          }
          .preview-canvas {
            height: 300px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;